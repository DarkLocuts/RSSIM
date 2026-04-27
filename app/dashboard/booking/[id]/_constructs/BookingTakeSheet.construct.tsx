/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCheckCircle, faImage } from "@fortawesome/free-solid-svg-icons";
import { ButtonComponent, BottomSheetComponent } from "@/components";

export function BookingTakeSheet({ bookingId, show, onClose, type }: { bookingId: string, show: boolean, onClose: () => void, type: "RENTED" | "RETURNED" }) {
  const router = useRouter();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [preview, setPreview] = useState<{ blob: Blob, dataUrl: string } | null>(null);
  const [submittingCamera, setSubmittingCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPreview({ blob: file, dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 720 }, height: { ideal: 720 } },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      } catch {
        setCameraError("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.");
      }
    };

    if (show) {
      setCameraError("");
      setCameraReady(false);
      setPreview(null);
      startCamera();
    }

    return () => { if (stream) stream.getTracks().forEach((track) => track.stop()); };
  }, [show]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        const dataURI = canvas.toDataURL("image/jpeg", 0.8);
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        setPreview({ blob: new Blob([ab], { type: mimeString }), dataUrl: dataURI });
      }
    }
  };

  const handleRetake = () => {
    setPreview(null);
  };

  const submitPhoto = async () => {
    if (!preview) return;
    setSubmittingCamera(true);
    
    const formData = new FormData();
    formData.append("status", type);
    formData.append("image", preview.blob, `pengambilan-${bookingId}.jpg`);
    
    const res = await api({
      path: `bookings/${bookingId}/update-status`,
      method: "PUT",
      payload: formData
    });
    
    if (res?.status === 200 || res?.status === 201) {
      onClose();
      router.refresh();
    }
    setSubmittingCamera(false);
  };

  return (
    <BottomSheetComponent show={show} onClose={onClose} size="85vh" className="z-[60]">
      <div className="p-4 flex flex-col gap-4 h-full">
        <h3 className="text-lg font-bold">Foto {type === "RENTED" ? "Pengambilan" : "Pengembalian"}</h3>
        
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-black/5">
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
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="flex gap-3 mt-auto pb-4">
          {preview ? (
            <>
              <ButtonComponent
                label="Ulangi"
                onClick={handleRetake}
                variant="outline"
                rounded
                block
                className="py-3 flex-1"
                disabled={submittingCamera}
              />
              <ButtonComponent
                icon={faCheckCircle}
                label="Konfirmasi"
                onClick={submitPhoto}
                loading={submittingCamera}
                rounded
                block
                className="py-3 flex-1"
                disabled={submittingCamera}
              />
            </>
          ) : (
            <div className="flex gap-2 w-full">
              <ButtonComponent
                icon={faCamera}
                label="Ambil Foto"
                onClick={capturePhoto}
                rounded
                block
                className="py-3 flex-[2]"
                disabled={!cameraReady || submittingCamera}
              />
              <ButtonComponent
                icon={faImage}
                label="Galeri"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                rounded
                block
                className="py-3 flex-1"
                disabled={submittingCamera}
              />
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
              />
            </div>
          )}
        </div>
      </div>
    </BottomSheetComponent>
  );
}
