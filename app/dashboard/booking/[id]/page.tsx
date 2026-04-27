"use client"

import { useEffect, useState, use } from "react";
import { api } from "@utils";
import { HeadbarComponent } from "@components";

import { BookingDetailSectionComponent } from "./_structures/BookingDetailSection.component";
import { PaymentListSectionComponent } from "./_structures/PaymentListSection.construct";
import { AddPaymentSheetComponent } from "./_constructs/AddPaymentSheet.construct";
import { AddPenaltySheetComponent } from "./_constructs/AddPenaltySheet.construct";
import { BookingActivityLogSectionComponent } from "./_structures/BookingActivityLogSection.construct";


export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams  =  use(params);
  const { id }          =  resolvedParams;

  const [booking, setBooking]                =  useState<any>(null);
  const [loading, setLoading]                =  useState(true);
  const [showAddPayment, setShowAddPayment]  =  useState(false);
  const [showAddPenalty, setShowAddCharge]   =  useState(false);

  const fetchBooking = async () => {
    setLoading(true);
    const res = await api({
      path: `bookings/${id}`,
    });

    if (res?.status === 200) {
      const data = res.data?.data || res.data;
      setBooking(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="px-2">
        <HeadbarComponent title="Detail Pesanan" />
        <div className="flex justify-center items-center mt-32">
          <p className="text-on-surface-variant animate-pulse font-medium">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="px-2">
        <HeadbarComponent title="Detail Pesanan" />
        <div className="flex justify-center items-center mt-32">
          <div className="bg-white p-6 rounded-xl border text-center shadow-sm max-w-sm w-full">
            <h2 className="text-lg font-bold text-danger mb-2">Tidak Ditemukan</h2>
            <p className="text-on-surface-variant text-sm">Pesanan tidak dapat ditemukan.</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="px-2 pb-6">
      <HeadbarComponent title="Detail Pesanan" />

      <div className="flex flex-col gap-2 mt-2">
        <BookingDetailSectionComponent booking={booking} onRefresh={fetchBooking} />
        <PaymentListSectionComponent payments={booking.payments || []} booking={booking} onAddCharge={() => setShowAddCharge(true)} onAddPayment={() => setShowAddPayment(true)} />
        <BookingActivityLogSectionComponent logs={booking.booking_logs || []} />
      </div>

      <AddPaymentSheetComponent
        show={showAddPayment}
        onClose={() => setShowAddPayment(false)}
        bookingId={id}
        onSuccess={fetchBooking}
      />

      <AddPenaltySheetComponent
        show={showAddPenalty}
        onClose={() => setShowAddCharge(false)}
        bookingId={id}
        onSuccess={fetchBooking}
      />
    </div>
  );
}