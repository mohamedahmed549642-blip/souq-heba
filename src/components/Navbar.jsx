import React from 'react';
import { ShoppingBag, Search, Store, X, Lock, LogOut } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Navbar() {
  const {
    cartTotalItems,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    openAdminPortal,
    adminLogout,
    lowStockCount,
    outOfStockCount
  } = useShop();

  const totalStockAlerts = lowStockCount + outOfStockCount;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all" dir="rtl">
      {/* شريط الإعلانات العلوي */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-bold">
              عرض حصري
            </span>
            <span className="hidden sm:inline">✨ توصيل سريع ومجاني للطلبات فوق 1,000 ج.م! استخدم كود <strong className="text-amber-300 font-extrabold">HEBA10</strong> لخصم 10%</span>
            <span className="sm:hidden">✨ كود خصم 10%: <strong className="text-amber-300">HEBA10</strong></span>
          </div>
          <div className="flex items-center gap-3 text-emerald-100">
            <span className="font-bold text-amber-300">سوق هبة الأصيل</span>
          </div>
        </div>
      </div>

      {/* الشريط الرئيسي */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* شعار المتجر */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdminOpen(false)}
            className="flex items-center gap-2.5 text-right group transition focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                  سوق هبة
                </span>
                <span className="text-[11px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded">
                  متجر رسمي
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                جودة وأصالة • تسوق إلكتروني ومخزون ذكي
              </p>
            </div>
          </button>
        </div>

        {/* شريط البحث المكتبي (يظهر للزبائن فقط في المتجر) */}
        {!isAdminOpen && (
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن العطور، العبايات، القهوة، أو كود المنتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-10 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-900 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="flex items-center gap-2.5">
          {/* زر دخول الإدارة المحمي بكلمة مرور */}
          {!isAdminOpen ? (
            <button
              onClick={openAdminPortal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
              title="دخول المشرف (محمي بكلمة مرور)"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">دخول الإدارة</span>
              <span className="sm:hidden">إدارة</span>
              {isAdminAuthenticated && totalStockAlerts > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                  {totalStockAlerts}
                </span>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAdminOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
              >
                <Store className="w-4 h-4 text-emerald-600" />
                <span>عرض المتجر</span>
              </button>
              <button
                onClick={adminLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
                title="تسجيل الخروج وقفل لوحة الإدارة"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>
            </div>
          )}

          {/* زر السلة (دائماً متاح للزبائن) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
            aria-label="سلة التسوق"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">السلة</span>
            {cartTotalItems > 0 && (
              <span className="bg-amber-400 text-slate-950 text-xs px-2 py-0.5 rounded-full font-extrabold animate-bounce">
                {cartTotalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* شريط البحث للهواتف */}
      {!isAdminOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative w-full">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن منتج، عطر، عباية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-8 py-2 bg-slate-100 text-xs text-slate-900 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
