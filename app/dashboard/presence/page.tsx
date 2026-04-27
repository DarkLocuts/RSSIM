/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCamera, faCheckCircle, faCheckDouble } from "@fortawesome/free-solid-svg-icons"

import { HeadbarComponent, ButtonComponent } from "@components"
import { PresenceClockComponent } from "@app"
import { api } from "@utils"
import { useAuthContext } from "@contexts"
import { useRouter } from "next/navigation"

export default function PresencePage() {
  const router                           =  useRouter()
  const {user}                           =  useAuthContext()
  const videoRef                         =  useRef<HTMLVideoElement>(null)
  const [cameraReady, setCameraReady]    =  useState(false)
  const [cameraError, setCameraError]    =  useState("")
  const [presenceData, setPresenceData]  =  useState<any>(null)
  const [loading, setLoading]            =  useState(true)
  const [submitting, setSubmitting]      =  useState(false)
  const [preview, setPreview]            =  useState<{ blob: Blob, dataUrl: string } | null>(null)

  const fetchPresence = async () => {
    setLoading(true)
    const res = await api({ path: "presences", method: "GET", params: { filter: [{column: "user_id", type: "eq", value: user?.id}, {column: "date", type: "eq", value: new Date().toISOString().split("T")[0]}]} })
    if (res?.status === 200) {
      setPresenceData(res.data?.data?.at(0) || null)
    }
    setLoading(false)
  }

  useEffect(() => {
    if(user?.id) fetchPresence()
  }, [user])

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
          audio: false,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setCameraReady(true)
        }
      } catch {
        setCameraError("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.")
      }
    }

    startCamera()

    return () => { if (stream) stream.getTracks().forEach((track) => track.stop()) }
  }, [])

  const capturePhoto = (): { blob: Blob, dataUrl: string } | null => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        
        const dataURI = canvas.toDataURL("image/jpeg", 0.8)
        const byteString = atob(dataURI.split(',')[1])
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return { blob: new Blob([ab], { type: mimeString }), dataUrl: dataURI }
      }
    }
    return null
  }

  const handleCaptureClick = () => {
    const result = capturePhoto()
    if (result) {
      setPreview(result)
    }
  }

  const handleRetake = () => {
    setPreview(null)
  }

  const handleSubmit = async () => {
    if (!preview) return
    
    setSubmitting(true)
    const type = (!presenceData || !presenceData.check_in) ? "check-in" : "check-out"
    
    const formData = new FormData()
    const now = new Date()
    const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

    formData.append("date", dateString)

    if((!presenceData || !presenceData.check_in)) {
      formData.append("check_in", timeString)
    } else {
      formData.append("check_out", timeString)
    }

    formData.append("image", preview.blob, `presence-${type}.jpg`)
    
    const res = await api({
      path: presenceData?.id ? `presences/${presenceData?.id}` : "presences",
      method: presenceData?.id ? "PUT" : "POST",
      payload: formData
    })
    
    if (res?.status === 200 || res?.status === 201) {
      setPreview(null)
      await fetchPresence()
      router.push("/dashboard")
    }
    setSubmitting(false)
  }

  const isCheckedIn = presenceData && presenceData.check_in
  const isCheckedOut = presenceData && presenceData.check_out

  if (isCheckedOut) {
    return (
      <div className="px-2">
        <HeadbarComponent title="Presensi" />
        <div className="flex flex-col items-center justify-center mt-32 text-center gap-4">
          <div className="w-20 h-20 rounded-full bg-light-success flex items-center justify-center">
            <FontAwesomeIcon icon={faCheckDouble} className="text-success text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-on-surface">Presensi Selesai</h2>
          <p className="text-sm text-on-surface-variant">Anda telah menyelesaikan presensi hari ini.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-2">
      <HeadbarComponent title="Presensi" />

      <div className="text-center mb-8 mt-6">
        <PresenceClockComponent />
      </div>

      <div>
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden">
          {cameraError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <div className="w-14 h-14 rounded-full bg-light-danger flex items-center justify-center">
                <FontAwesomeIcon icon={faCamera} className="text-danger text-xl" />
              </div>
              <p className="text-sm text-foreground/70">{cameraError}</p>
            </div>
          ) : preview ? (
            <img 
              src={preview.dataUrl} 
              alt="Preview" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            </>
          )}
        </div>

        <div className={`fixed bottom-0 left-0 w-full p-4 bg-white rounded-t-xl z-[55] transition-all duration-300`}>
          <div className="max-w-md mx-auto flex gap-3">
            {preview ? (
              <>
                <ButtonComponent
                  label="Ulangi"
                  onClick={handleRetake}
                  variant="outline"
                  rounded
                  block
                  className="py-3 flex-1"
                  disabled={submitting}
                />
                <ButtonComponent
                  icon={faCheckCircle}
                  label="Konfirmasi"
                  onClick={handleSubmit}
                  loading={submitting}
                  rounded
                  block
                  className="py-3 flex-1"
                  disabled={submitting}
                />
              </>
            ) : (
              <ButtonComponent
                icon={faCamera}
                label={loading ? "Memuat..." : (isCheckedIn ? "Pulang" : "Masuk")}
                onClick={handleCaptureClick}
                loading={submitting}
                rounded
                block
                className="py-3 w-full"
                disabled={!cameraReady || loading || submitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
