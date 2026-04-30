"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxesStacked, faUsers, faBuilding, faChevronRight, faPen, faBook, faUserPen, faLock, faRightFromBracket, faCreditCard, faCalendarCheck, faBell } from "@fortawesome/free-solid-svg-icons";

import { auth } from "@utils";
import { ModalConfirmComponent, ToastComponent } from "@components";
import { UpdateProfileComponent } from "./_structures/UpdateProfile.component";
import { UpdatePasswordComponent } from "./_structures/UpdatePassword.component";
import { useAuthContext } from "@/contexts";


export default function AkunPage() {
  const router    =  useRouter();
  const { user }  =  useAuthContext()

  const [showEditProfile, setShowEditProfile]        =  useState(false);
  const [showChangePassword, setShowChangePassword]  =  useState(false);
  const [showLogout, setShowLogout]                  =  useState(false);
  const [showToast, setShowToast]                    =  useState<string | false>(false);


  const managementItems = [
    {
      icon: faBoxesStacked,
      label: "Jenis Unit",
      description: "Atur jenis unit",
      href: "/dashboard/category",
      color: "text-primary",
      bg: "bg-blue-50",
    },
    {
      icon: faBuilding,
      label: "Cabang",
      description: "Atur outlet / cabang",
      href: "/dashboard/outlet",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      icon: faCreditCard,
      label: "Metode Pembayaran",
      description: "Atur metode pembayaran",
      href: "/dashboard/payment-method",
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      icon: faUsers,
      label: "Akun / Karyawan",
      description: "Kelola akun dan hak akses",
      href: "/dashboard/user",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: faCalendarCheck,
      label: "Kehadiran Karyawan",
      description: "Lihat kehadiran karyawan",
      href: "/dashboard/presence/list",
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
  ];


  const reportItems = [
    {
      icon: faPen,
      label: "Catat Transaksi",
      description: "Kelola & Catat transaksi",
      href: "/dashboard/transaction",
      color: "text-warning",
      bg: "bg-amber-50",
    },
    {
      icon: faBook,
      label: "Pembukuan",
      description: "Lihat laporan keuangan",
      href: "/dashboard/report",
      color: "text-primary",
      bg: "bg-blue-50",
    },
  ];


  const userItems = [
    {
      icon: faUserPen,
      label: "Ubah Profil",
      description: "Mengubah data profil",
      onClick: () => setShowEditProfile(true),
      color: "text-primary",
      bg: "bg-blue-50",
    },
    {
      icon: faLock,
      label: "Ubah Password",
      description: "Mengubah password akun",
      onClick: () => setShowChangePassword(true),
      color: "text-warning",
      bg: "bg-amber-50",
    },
    {
      icon: faBell,
      label: "Notifikasi",
      description: "Lihat notifikasi yang masuk",
      onClick: () => router.push("/dashboard/notification"),
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      icon: faRightFromBracket,
      label: "Keluar",
      description: "Keluar dari akun saat ini",
      onClick: () => setShowLogout(true),
      color: "text-danger",
      bg: "bg-red-50",
    },
  ];


  return (
    <div className="px-2 pt-2">
      <div className="flex items-center gap-4 p-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-primary">
            {(user?.name || "?").charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{user?.name}</h1>
          <p className="text-sm font-medium">{user?.role?.name} • <span className="font-semibold">@{user?.username}</span></p>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2 px-1 mt-6">
          <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Manajemen
          </h2>
        </div>
        <div className="bg-white rounded-xl border">
          {managementItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-4 ${index === managementItems.length - 1 ? "" : "border-b"} active:scale-[0.98]`}
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <FontAwesomeIcon icon={item.icon} className={`text-lg ${item.color}`} />
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="text-sm font-bold text-on-surface">{item.label}</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">{item.description}</p>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="text-xs mr-2 text-light-foreground" />
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2 px-1 mt-8">
          <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Laporan
          </h2>
        </div>
        <div className="bg-white rounded-xl border">
          {reportItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-4 ${index === reportItems.length - 1 ? "" : "border-b"} active:scale-[0.98]`}
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <FontAwesomeIcon icon={item.icon} className={`text-lg ${item.color}`} />
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="text-sm font-bold text-on-surface">{item.label}</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">{item.description}</p>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="text-xs mr-2 text-light-foreground" />
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2 px-1 mt-8">
          <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Akun
          </h2>
        </div>
        <div className="bg-white rounded-xl border">
          {userItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`w-full flex items-center justify-between gap-4 px-4 py-4 ${index === userItems.length - 1 ? "" : "border-b"} active:scale-[0.98]`}
            >
              <div className="flex items-center text-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  <FontAwesomeIcon icon={item.icon} className={`text-lg ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold">{item.label}</h3>
                  <p className="text-xs mt-0.5">{item.description}</p>
                </div>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="text-xs mr-2 text-light-foreground" />
            </button>
          ))}
        </div>
      </div>

      <div className="text-center pb-4 mt-12">
        <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
          RSSIM v1.0.0
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Creative By SEJE Digital
        </p>
      </div>

      <UpdateProfileComponent
        show={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      />

      <UpdatePasswordComponent
        show={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      <ModalConfirmComponent
        show={showLogout}
        onClose={() => setShowLogout(false)}
        title="Yakin ingin keluar?"
        submitControl={{
          onClick: () => {
            auth.deleteAccessToken();
            router.push("/");
          },
        }}
      />

      <ToastComponent
        show={!!showToast}
        onClose={() => setShowToast(false)}
        title={showToast}
        paint="success"
      />
    </div>
  );
}
