"use client"

import { useEffect, useState, use } from "react";
import { api } from "@utils";
import {
  HeadbarComponent,
  IconButtonComponent,
} from "@components";
import { faMoneyBillWave, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

import { BookingDetailSectionComponent } from "./_structures/BookingDetailSection.component";
import { PaymentListSectionComponent } from "./_constructs/PaymentListSection.construct";
import { AddPaymentSheetComponent } from "./_constructs/AddPaymentSheet.construct";
import { AddPenaltySheetComponent } from "./_constructs/AddPenaltySheet.construct";


export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [booking, setBooking]              = useState<any>(null);
  const [loading, setLoading]              = useState(true);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddPenalty, setShowAddPenalty]  = useState(false);

  const fetchBooking = async () => {
    setLoading(true);
    const res = await api({
      path: `bookings/${id}`,
      params: {
        expand: ["unit", "unit.unit_category", "payments", "payments.payment_method"],
      },
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


  // Loading state
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

  // Not found state
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

      <div className="flex flex-col gap-4 mt-2">
        {/* Booking Detail Section */}
        <BookingDetailSectionComponent booking={booking} />

        {/* Payment List Section */}
        <PaymentListSectionComponent payments={booking.payments || []} />
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-40 right-5 flex flex-col gap-3 z-50">
        <IconButtonComponent
          icon={faMoneyBillWave}
          className="w-12 h-12 bg-primary text-white transform active:scale-95 transition-transform shadow-lg shadow-primary/30"
          size="md"
          rounded
          onClick={() => setShowAddPayment(true)}
        />
        <IconButtonComponent
          icon={faExclamationTriangle}
          className="w-12 h-12 bg-danger text-white transform active:scale-95 transition-transform shadow-lg shadow-red-200"
          size="md"
          rounded
          onClick={() => setShowAddPenalty(true)}
        />
      </div>

      {/* Add Payment Bottom Sheet */}
      <AddPaymentSheetComponent
        show={showAddPayment}
        onClose={() => setShowAddPayment(false)}
        bookingId={id}
        onSuccess={fetchBooking}
      />

      {/* Add Penalty Bottom Sheet */}
      <AddPenaltySheetComponent
        show={showAddPenalty}
        onClose={() => setShowAddPenalty(false)}
        bookingId={id}
        onSuccess={fetchBooking}
      />
    </div>
  );
}