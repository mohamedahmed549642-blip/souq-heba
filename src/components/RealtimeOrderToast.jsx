import React from 'react';
import { ShoppingBag, X, ArrowLeft, BellRing } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/format';

export default function RealtimeOrderToast() {
  const {
    realtimeOrderAlert,
    dismissRealtimeOrderAlert,
    isAdminAuthenticated,
    setIsAdminOpen,
    setCurrentAdminTab,
    setIsTrackingOpen
  } = useShop();

  if (!realtimeOrderAlert) return null;

  const handleOpenOrder = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
      setCurrentAdminTab('orders');
    } else {
      setIsTrackingOpen(true);
    }
    dismissRealtimeOrderAlert();
  };

  return (
    <div
      className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-2xl border-2 border-emerald-500 p-4 animate-in slide-in-from-bottom duration-300 text-right"
      dir="rtl"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold animate-bounce">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-emerald-400">🚨 طلب شراء جديد وارد الآن!</h4>
            <span className="text-[11px] text-slate-400 font-mono">كود: {realtimeOrderAlert.id}</span>
          </div>
        </div>

        <button
          onClick={dismissRealtimeOrderAlert}
          className="text-slate-400 hover:text-white transition p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="text-xs space-y-1 mb-3 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
        <p className="font-bold text-white truncate">
          العميل: {realtimeOrderAlert.customer?.name}
        </p>
        <p className="text-slate-300 text-[11px] truncate">
          العنوان: {realtimeOrderAlert.customer?.address}
        </p>
        <div className="flex items-center justify-between pt-1 border-t border-slate-700 text-emerald-300 font-bold">
          <span>المبلغ كاش عند الاستلام:</span>
          <span className="text-sm font-black text-white">{formatCurrency(realtimeOrderAlert.total)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleOpenOrder}
          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>معاينة تفاصيل الطلب</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={dismissRealtimeOrderAlert}
          className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}
