import React, { useState } from 'react';
import { ShoppingBag, Search, MessageCircle, X, Tag, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/format';

export default function Navbar() {
  const {
    cartTotalItems,
    cartSubtotal,
    setIsCartOpen,
    searchQuery,
    setSearchQuery
  } = useShop();

  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText('HEBA10');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.warn("Clipboard access error:", e);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all" dir="rtl">
      {/* شريط الإعلانات العلوي بألوان الهوية البصرية (كحلي ملكي + برتقالي نشط) */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0c2340] to-orange-600 text-white py-1.5 px-2.5 sm:px-4 font-medium border-b border-white/10">
        {/* للهواتف المحمولة: تصميم متجاوب 100% يضمن ظهور كود الخصم والشحن والواتساب بوضوح تام وبدون أي اقتصاص */}
        <div className="flex sm:hidden items-center justify-between gap-1.5 w-full text-[11px]">
          {/* كود الخصم البارز القابل للنسخ بنقرة واحدة */}
          <button
            type="button"
            onClick={handleCopyCode}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-black text-[10px] shadow-sm transition active:scale-95 shrink-0 cursor-pointer ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950'
            }`}
            title="اضغط لنسخ كود الخصم"
          >
            {copied ? (
              <>
                <Check className="w-2.5 h-2.5" />
                <span>تم نسخ HEBA10 ✓</span>
              </>
            ) : (
              <>
                <Tag className="w-2.5 h-2.5" />
                <span>كود: <strong className="font-mono">HEBA10</strong></span>
                <span className="text-[9px] bg-black/15 px-1 rounded font-bold">خصم 10%</span>
              </>
            )}
          </button>

          {/* ميزة الشحن المجاني */}
          <div className="flex items-center gap-1 text-[10.5px] font-bold text-white shrink-0">
            <span>🚚 شحن مجاني</span>
          </div>

          {/* طلب واتساب السريع */}
          <a
            href="https://wa.me/201099298496"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-300 hover:text-white font-bold text-[10px] shrink-0 bg-white/10 hover:bg-white/20 px-1.5 py-0.5 rounded-md transition"
            title="طلب فوري عبر واتساب"
          >
            <MessageCircle className="w-3 h-3 text-emerald-400" />
            <span>واتساب</span>
          </a>
        </div>

        {/* لأجهزة الديسكتوب والتابلت */}
        <div className="hidden sm:flex max-w-7xl mx-auto items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm">
              عرض حصري
            </span>
            <span className="font-medium text-slate-100">
              🚚 شحن وتوصيل مجاني لكافة محافظات مصر! كود الخصم:
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-black text-xs shadow-sm transition active:scale-95 cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950'
              }`}
              title="اضغط لنسخ الكود"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>تم نسخ الكود HEBA10 ✓</span>
                </>
              ) : (
                <>
                  <Tag className="w-3 h-3" />
                  <span className="font-mono font-black">HEBA10</span>
                  <span className="text-[10px] font-bold text-amber-950 bg-black/10 px-1.5 rounded">خصم 10% فوري</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-xs">الدفع كاش عند الاستلام بعد المعاينة</span>
            <div className="h-3.5 w-px bg-white/20" />
            <a
              href="https://wa.me/201099298496"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-orange-200 hover:text-white transition font-bold text-xs"
              title="تواصل معنا عبر واتساب"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>طلب سريع:</span>
              <span className="font-mono text-white text-xs ltr" dir="ltr">01099298496</span>
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
            className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition active:scale-95 cursor-pointer"
            aria-label="سلة التسوق"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">سلة المشتريات</span>
            {cartTotalItems > 0 ? (
              <span className="flex items-center gap-1 bg-slate-950/85 text-white text-[11px] px-2 py-0.5 rounded-full font-black shadow-sm">
                <span>{cartTotalItems}</span>
                <span className="text-[10px] text-amber-300 font-bold hidden xs:inline">
                  • {formatCurrency(cartSubtotal)}
                </span>
              </span>
            ) : null}
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
