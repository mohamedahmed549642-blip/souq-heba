import React from 'react';
import {
  Store,
  Grid,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function MobileBottomNav() {
  const {
    cartTotalItems,
    setIsCartOpen,
    setSelectedCategory,
    selectedCategory,
    scrollToProducts,
    showDeals
  } = useShop();

  // Scroll to categories section
  const handleScrollToCategories = () => {
    scrollToProducts();
  };

  const handleScrollToTop = () => {
    setSelectedCategory('الكل');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToDeals = () => {
    showDeals();
  };

  const isDealsActive = selectedCategory === '🔥 العروض والتخفيضات';
  const isHomeActive = selectedCategory === 'الكل' || selectedCategory === 'جميع الأقسام';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))]"
      dir="rtl"
      aria-label="شريط التنقل السريع للهواتف"
    >
      <div className="grid grid-cols-4 items-center text-center">
        {/* المتجر / الرئيسية */}
        <button
          onClick={handleScrollToTop}
          className={`flex flex-col items-center justify-center py-1 active:scale-95 transition cursor-pointer ${
            isHomeActive ? 'text-orange-600 font-black' : 'text-slate-600 hover:text-orange-600'
          }`}
        >
          <div className="w-9 h-7 flex items-center justify-center">
            <Store className={`w-5 h-5 ${isHomeActive ? 'text-orange-600' : 'text-slate-500'}`} />
          </div>
          <span className="text-[10px] font-bold mt-0.5 leading-none">الرئيسية</span>
        </button>

        {/* الأقسام */}
        <button
          onClick={handleScrollToCategories}
          className="flex flex-col items-center justify-center py-1 text-slate-600 hover:text-orange-600 active:scale-95 transition cursor-pointer"
        >
          <div className="w-9 h-7 flex items-center justify-center">
            <Grid className="w-5 h-5 text-[#0c2340]" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 leading-none">الأقسام</span>
        </button>

        {/* العروض والتخفيضات */}
        <button
          onClick={handleScrollToDeals}
          className={`relative flex flex-col items-center justify-center py-1 active:scale-95 transition cursor-pointer ${
            isDealsActive ? 'text-amber-500 font-black' : 'text-slate-600 hover:text-amber-500'
          }`}
        >
          <div className="relative w-9 h-7 flex items-center justify-center">
            <Sparkles className={`w-5 h-5 ${isDealsActive ? 'text-amber-500 animate-bounce' : 'text-amber-500'}`} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <span className="text-[10px] font-bold mt-0.5 leading-none">العروض 🔥</span>
        </button>

        {/* سلة المشتريات */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 text-slate-700 hover:text-orange-600 active:scale-95 transition cursor-pointer"
        >
          <div className="relative w-9 h-7 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            {cartTotalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                {cartTotalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5 leading-none">السلة</span>
        </button>
      </div>
    </nav>
  );
}
