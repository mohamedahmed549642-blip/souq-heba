import React from 'react';
import { ShoppingBag, ArrowLeft, Eye } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/format';

export default function FloatingCartBar() {
  const {
    cartTotalItems,
    cartSubtotal,
    setIsCheckoutOpen,
    setIsCartOpen,
    isAdminRoute
  } = useShop();

  // لا يظهر الشريط إطلاقاً إذا كانت السلة فارغة أو في لوحة الإدارة
  if (isAdminRoute || cartTotalItems <= 0) return null;

  return (
    <aside
      className="fixed bottom-3 left-3 right-3 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg z-50 animate-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
      dir="rtl"
      aria-label="شريط متابعة الشراء العائم"
    >
      <div className="bg-[#071629]/95 backdrop-blur-xl text-white rounded-2xl sm:rounded-full px-3 py-2 sm:px-4 sm:py-2.5 border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.4)] ring-1 ring-orange-500/40 flex items-center justify-between gap-2">
        {/* معلومات السلة ومحتوياتها */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 text-right focus:outline-none cursor-pointer group shrink-0"
          title="عرض تفاصيل سلة المشتريات"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-orange-400 transition shrink-0">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
              {cartTotalItems}
            </span>
          </div>

          <div className="leading-tight">
            <div className="text-[10px] sm:text-xs text-slate-300 font-medium flex items-center gap-1">
              <span>سلتك</span>
              <span className="text-orange-400 font-bold group-hover:underline flex items-center gap-0.5 text-[10px]">
                <Eye className="w-2.5 h-2.5" />
                <span>عرض</span>
              </span>
            </div>
            <div className="text-xs sm:text-base font-black text-white whitespace-nowrap">
              {formatCurrency(cartSubtotal)}
            </div>
          </div>
        </button>

        {/* زر إتمام الطلب الفوري المباشر */}
        <button
          type="button"
          onClick={() => setIsCheckoutOpen(true)}
          className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/30 flex items-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
        >
          <span>إتمام الطلب والدفع</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
