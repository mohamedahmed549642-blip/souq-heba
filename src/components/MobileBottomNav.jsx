import React from 'react';
import {
  Store,
  Grid,
  Truck,
  ShoppingBag,
  Lock,
  LayoutDashboard,
  Boxes,
  Package,
  Bell,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function MobileBottomNav() {
  const {
    cartTotalItems,
    setIsCartOpen,
    isAdminOpen,
    setIsAdminOpen,
    openAdminPortal,
    currentAdminTab,
    setCurrentAdminTab,
    lowStockCount,
    outOfStockCount,
    isAdminAuthenticated
  } = useShop();

  const totalStockAlerts = lowStockCount + outOfStockCount;

  // Scroll to categories / products section
  const handleScrollToCategories = () => {
    setIsAdminOpen(false);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    setIsAdminOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))]"
      dir="rtl"
      aria-label="شريط التنقل السريع للهواتف"
    >
      {!isAdminOpen ? (
        /* --- شريط المتجر للزبائن --- */
        <div className="grid grid-cols-4 items-center text-center">
          {/* المتجر / الرئيسية */}
          <button
            onClick={handleScrollToTop}
            className="flex flex-col items-center justify-center py-1 text-slate-700 hover:text-emerald-700 active:scale-95 transition cursor-pointer"
          >
            <div className="w-9 h-7 flex items-center justify-center">
              <Store className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[10px] font-bold mt-0.5 leading-none">الرئيسية</span>
          </button>

          {/* الأقسام */}
          <button
            onClick={handleScrollToCategories}
            className="flex flex-col items-center justify-center py-1 text-slate-700 hover:text-emerald-700 active:scale-95 transition cursor-pointer"
          >
            <div className="w-9 h-7 flex items-center justify-center">
              <Grid className="w-5 h-5 text-slate-500" />
            </div>
            <span className="text-[10px] font-bold mt-0.5 leading-none">الأقسام</span>
          </button>

          {/* السلة */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center justify-center py-1 text-slate-700 hover:text-emerald-700 active:scale-95 transition cursor-pointer"
          >
            <div className="relative w-9 h-7 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {cartTotalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-0.5 leading-none">السلة</span>
          </button>

          {/* لوحة الإدارة */}
          <button
            onClick={openAdminPortal}
            className="relative flex flex-col items-center justify-center py-1 text-slate-700 hover:text-emerald-700 active:scale-95 transition cursor-pointer"
          >
            <div className="relative w-9 h-7 flex items-center justify-center">
              <Lock className="w-5 h-5 text-slate-500" />
              {isAdminAuthenticated && totalStockAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  !
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold mt-0.5 leading-none">الإدارة</span>
          </button>
        </div>
      ) : (
        /* --- شريط المشرف عند فتح لوحة الإدارة --- */
        <div className="grid grid-cols-5 items-center text-center">
          {/* المؤشرات */}
          <button
            onClick={() => setCurrentAdminTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              currentAdminTab === 'dashboard' ? 'text-emerald-700 font-black' : 'text-slate-500'
            }`}
          >
            <div className={`w-9 h-7 flex items-center justify-center rounded-lg ${
              currentAdminTab === 'dashboard' ? 'bg-emerald-100 text-emerald-800' : ''
            }`}>
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 leading-none">المؤشرات</span>
          </button>

          {/* المخزون */}
          <button
            onClick={() => setCurrentAdminTab('inventory')}
            className={`relative flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              currentAdminTab === 'inventory' ? 'text-emerald-700 font-black' : 'text-slate-500'
            }`}
          >
            <div className={`relative w-9 h-7 flex items-center justify-center rounded-lg ${
              currentAdminTab === 'inventory' ? 'bg-emerald-100 text-emerald-800' : ''
            }`}>
              <Boxes className="w-4 h-4" />
              {totalStockAlerts > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-slate-950 font-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {totalStockAlerts}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 leading-none">المخزون</span>
          </button>

          {/* المنتجات */}
          <button
            onClick={() => setCurrentAdminTab('products')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              currentAdminTab === 'products' ? 'text-emerald-700 font-black' : 'text-slate-500'
            }`}
          >
            <div className={`w-9 h-7 flex items-center justify-center rounded-lg ${
              currentAdminTab === 'products' ? 'bg-emerald-100 text-emerald-800' : ''
            }`}>
              <Package className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 leading-none">المنتجات</span>
          </button>

          {/* الطلبات */}
          <button
            onClick={() => setCurrentAdminTab('orders')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              currentAdminTab === 'orders' ? 'text-emerald-700 font-black' : 'text-slate-500'
            }`}
          >
            <div className={`w-9 h-7 flex items-center justify-center rounded-lg ${
              currentAdminTab === 'orders' ? 'bg-emerald-100 text-emerald-800' : ''
            }`}>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 leading-none">الطلبات</span>
          </button>

          {/* إشعارات الموبايل */}
          <button
            onClick={() => setCurrentAdminTab('notifications')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              currentAdminTab === 'notifications' ? 'text-emerald-700 font-black' : 'text-slate-500'
            }`}
          >
            <div className={`w-9 h-7 flex items-center justify-center rounded-lg ${
              currentAdminTab === 'notifications' ? 'bg-emerald-100 text-emerald-800' : ''
            }`}>
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 leading-none">التنبيهات</span>
          </button>
        </div>
      )}
    </nav>
  );
}
