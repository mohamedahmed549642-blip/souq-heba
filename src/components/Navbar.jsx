import React from 'react';
import { ShoppingBag, Search, MessageCircle, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Navbar() {
  const {
    cartTotalItems,
    setIsCartOpen,
    searchQuery,
    setSearchQuery
  } = useShop();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all" dir="rtl">
      {/* شريط الإعلانات العلوي بألوان الهوية البصرية (كحلي ملكي + برتقالي نشط) */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0c2340] to-orange-600 text-white text-xs py-1.5 px-4 font-medium border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-sm">
              عرض حصري
            </span>
            <span className="hidden sm:inline">
              🚚 شحن وتوصيل مجاني لجميع محافظات مصر! كود الخصم: <strong className="text-amber-300 font-black">HEBA10</strong>
            </span>
            <span className="sm:hidden text-[11px]">
              🚚 شحن مجاني لكافة مصر • كود: <strong className="text-amber-300 font-black">HEBA10</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/201099298496"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-orange-200 hover:text-white transition font-bold text-[11px]"
              title="تواصل معنا عبر واتساب"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">طلب سريع:</span>
              <span className="font-mono text-white text-[11px] ltr" dir="ltr">01099298496</span>
            </a>
          </div>
        </div>
      </div>

      {/* الشريط الرئيسي للعملاء */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 sm:gap-4">
        {/* شعار المتجر الرسمي من الهوية البصرية */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 sm:gap-3 text-right group transition focus:outline-none cursor-pointer"
          >
            {/* الشعار الدائري الحقيقي لسوق هبة */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white shadow-md shadow-orange-500/15 ring-2 ring-orange-500/30 group-hover:ring-orange-500/70 group-hover:scale-105 transition-all shrink-0">
              <img
                src="/logo.png"
                alt="شعار سوق هبة الرسمي"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-[#0c2340] group-hover:text-orange-600 transition">
                  سوق هبة
                </span>
                <span className="text-[10px] bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black px-1.5 py-0.5 rounded shadow-sm">
                  ELECTRONICS
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold tracking-wide hidden xs:block">
                Souq Heba • أجهزة ذكية وإلكترونيات أصلية
              </p>
            </div>
          </a>
        </div>

        {/* شريط البحث المكتبي */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن باور بانك، ساعات ذكية، سماعات، أجهزة عناية، أو زيت سيناء..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-10 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs sm:text-sm text-slate-900 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-inner"
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

        {/* أزرار الإجراءات للعميل */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* زر واتساب السريع */}
          <a
            href="https://wa.me/201099298496"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 text-xs font-bold transition shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>طلب واتساب</span>
          </a>

          {/* زر السلة المميز بألوان الهوية */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition active:scale-95 cursor-pointer"
            aria-label="سلة التسوق"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">سلة المشتريات</span>
            {cartTotalItems > 0 && (
              <span className="bg-slate-950 text-white text-[11px] px-2 py-0.5 rounded-full font-black animate-bounce shadow">
                {cartTotalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* شريط البحث للهواتف المحمولة */}
      <div className="md:hidden px-3 pb-2.5">
        <div className="relative w-full">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث عن باور بانك، ساعة، سماعة، منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-8 py-2 bg-slate-100 text-xs text-slate-900 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
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
    </header>
  );
}