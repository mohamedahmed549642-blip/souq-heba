import React from 'react';
import { ArrowLeft, Tag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function HeroBanner() {
  const { showDeals } = useShop();

  return (
    <div
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#071622] text-white shadow-xl mb-4 sm:mb-6 border border-white/10 text-center py-5 sm:py-7 px-3 sm:px-6"
      dir="rtl"
    >
      {/* خلفية ضوئية خافتة وناعمة */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff06_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-36 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-xl mx-auto flex flex-col items-center">
        {/* الشريط العلوي الدائري النقطي (مستوحى من تصميم العميل) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider mb-2 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
          <span>عروض حصرية</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
          <span>سوق هبة STORE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
          <span>توصيل مجاني لكافة مصر</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
        </div>

        {/* العنوان البارز باللون البرتقالي الصريح والخط العريض */}
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#ff5c26] uppercase my-1">
          خصومات تصل حتى 45%
        </h1>

        {/* النص الفرعي التوضيحي */}
        <p className="text-xs sm:text-sm text-slate-300 font-semibold mb-2">
          على جميع الإلكترونيات والشواحن والأجهزة الأصلية
        </p>

        {/* زر / رابط تسوق العروض بتصميم أنيق ومسطر */}
        <button
          type="button"
          onClick={showDeals}
          className="inline-flex items-center gap-1.5 text-white hover:text-orange-400 font-black text-xs sm:text-sm underline underline-offset-8 decoration-orange-500 hover:decoration-orange-400 transition cursor-pointer my-1 group active:scale-95"
          title="اضغط للانتقال الفوري إلى عروض التخفيضات"
        >
          <span>تسوق العروض الآن</span>
          <ArrowLeft className="w-4 h-4 text-orange-400 group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* الملاحظة السفلية الخفيفة */}
        <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-3">
          معاينة وتجربة المنتج قبل الدفع • استبدال واسترجاع 14 يوماً
        </p>

        {/* الشريط السفلي النقطي */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-bold text-slate-500 tracking-wider mt-2 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500/70 inline-block" />
          <span>كود خصم 10%: HEBA10</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500/70 inline-block" />
          <span>دفع كاش عند الاستلام</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500/70 inline-block" />
        </div>
      </div>
    </div>
  );
}
