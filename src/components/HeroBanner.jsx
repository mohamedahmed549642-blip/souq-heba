import React from 'react';
import { Sparkles, ShieldCheck, Truck, RefreshCw, ArrowLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function HeroBanner() {
  const { setSelectedCategory } = useShop();

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl mb-5 sm:mb-8" dir="rtl">
      {/* خلفية تجميلية */}
      <div className="absolute top-0 left-0 -mt-12 -ml-12 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 -mb-20 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-6 sm:py-14 sm:px-10 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        <div className="max-w-2xl text-center md:text-right">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-emerald-300 text-[11px] sm:text-sm font-bold mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>تشكيلة حصرية • سوق هبة الأصيل</span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-tight mb-3 sm:mb-4">
            أناقة وفخامة أصيلة في <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              سوق هبة الإلكتروني
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-base mb-4 sm:mb-6 leading-relaxed">
            أندر العطور الشرقية ودهن العود، والعبايات الحريرية، وأحدث الأجهزة الذكية. شحن لجميع محافظات مصر والدفع كاش عند الاستلام.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
            <button
              onClick={() => setSelectedCategory('عطور وعود')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>تسوق العود والعطور</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedCategory('أزياء وعبايات')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/10 transition cursor-pointer"
            >
              تشكيلة العبايات
            </button>
          </div>
        </div>

        {/* بطاقات المميزات */}
        <div className="w-full md:w-auto grid grid-cols-2 gap-2 sm:gap-4 max-w-md">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-2.5 sm:p-4 rounded-xl sm:rounded-2xl text-right">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-1.5 sm:mb-2">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-white">توصيل لكافة مصر</h4>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">27 محافظة بالكامل.</p>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-2.5 sm:p-4 rounded-xl sm:rounded-2xl text-right">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-1.5 sm:mb-2">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-white">الدفع كاش فقط</h4>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">عند استلام شحنتك.</p>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-2.5 sm:p-4 rounded-xl sm:rounded-2xl text-right">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 mb-1.5 sm:mb-2">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-white">مخزون لحظي</h4>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">تتبع سحابي دقيق.</p>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-2.5 sm:p-4 rounded-xl sm:rounded-2xl text-right">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-1.5 sm:mb-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-white">كوبون خصم</h4>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">HEBA10 لخصم 10%.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
