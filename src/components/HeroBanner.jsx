import React from 'react';
import { Sparkles, ShieldCheck, Truck, Zap, Tag, MessageCircle, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function HeroBanner() {
  const { setSelectedCategory } = useShop();

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#071629] via-[#0c2340] to-slate-900 text-white shadow-2xl mb-5 sm:mb-8 border border-slate-800" dir="rtl">
      {/* خلفية جمالية بالألوان المميزة لشعار سوق هبة */}
      <div className="absolute top-0 left-0 -mt-16 -ml-16 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 -mb-20 w-80 h-80 bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-7 sm:py-12 sm:px-10 lg:px-12 flex flex-col-reverse md:flex-row items-center justify-between gap-6 sm:gap-10">
        {/* النصوص والأزرار */}
        <div className="max-w-2xl text-center md:text-right">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 px-3.5 py-1 rounded-full text-orange-300 text-xs sm:text-sm font-bold mb-3 sm:mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>الهوية الرسمية • متجر سوق هبة الإلكتروني</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight mb-3 sm:mb-4">
            أقوى الإلكترونيات والأجهزة الذكية في <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
              سوق هبة | Souq Heba
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-base mb-5 sm:mb-6 leading-relaxed font-normal">
            باور بانك فائق السرعة، ساعات وسماعات ذكية، أجهزة عناية شخصية، وزيت زيتون سيناء الطبيعي 100%. شحن مجاني لكافة محافظات مصر مع حق الفحص والمعاينة قبل الدفع.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
            <button
              onClick={() => setSelectedCategory('إلكترونيات وشواحن')}
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-500/30 transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>تسوق الإلكترونيات والشواحن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <a
              href="https://wa.me/201099298496"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>طلب مباشر واتساب</span>
            </a>
          </div>
        </div>

        {/* الشعار البصري المميز مع الهالة الضوئية */}
        <div className="flex flex-col items-center justify-center relative">
          <div className="relative group">
            {/* حلقة إضاءة متحركة بألوان اللوجو */}
            <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 via-amber-400 to-blue-600 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt pointer-events-none" />
            
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full p-1.5 bg-white shadow-2xl flex items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="شعار سوق هبة الرسمي"
                className="w-full h-full object-cover rounded-full transform group-hover:scale-105 transition duration-500"
              />
            </div>
          </div>
          <span className="mt-2.5 text-[11px] font-black tracking-widest text-orange-400 uppercase">
            Devices For A Better Life
          </span>
        </div>
      </div>

      {/* شريط المزايا الأربعة أسفل البانر */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-md px-4 sm:px-10 py-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-right">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">توصيل مجاني لكافة مصر</h4>
            <p className="text-[10px] text-slate-400">جميع الـ 27 محافظة حتى باب منزلك.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">الدفع كاش عند الاستلام</h4>
            <p className="text-[10px] text-slate-400">معاينة وفحص المنتج قبل دفع أي مليم.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">أجهزة وشواحن أصلية 100%</h4>
            <p className="text-[10px] text-slate-400">ضمان معتمد واستبدال خلال 14 يوماً.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">كود خصم 10% فوري</h4>
            <p className="text-[10px] text-slate-400">استخدم قسيمة <span className="text-amber-300 font-black">HEBA10</span> بالسلة.</p>
          </div>
        </div>
      </div>
    </div>
  );
}