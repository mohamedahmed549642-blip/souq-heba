import React from 'react';
import { MessageCircle, Instagram, Truck, ShieldCheck, RotateCcw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#071629] text-slate-400 border-t border-white/10 mt-12 py-8 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-4">
        {/* الشعار واسم المتجر */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-md ring-2 ring-orange-500/40 shrink-0">
            <img
              src="/logo.png"
              alt="شعار سوق هبة"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-right">
            <span className="font-black text-base sm:text-lg text-white block leading-tight">سوق هبة | Souq Heba</span>
            <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">ELECTRONICS STORE</span>
          </div>
        </div>

        {/* ملخص الضمان والشحن في سطر واحد خفيف */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-slate-300 font-medium">
          <span className="inline-flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            <Truck className="w-3 h-3 text-orange-400" />
            <span>شحن لكافة محافظات مصر</span>
          </span>
          <span className="inline-flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>الدفع عند الاستلام بعد المعاينة</span>
          </span>
          <span className="inline-flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            <RotateCcw className="w-3 h-3 text-blue-400" />
            <span>ضمان واستبدال 14 يوماً</span>
          </span>
        </div>

        {/* قنوات التواصل المباشرة السريعة */}
        <div className="flex items-center justify-center gap-2.5 pt-1">
          <a
            href="https://wa.me/201099298496"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full transition shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>واتساب: 01099298496</span>
          </a>

          <a
            href="https://instagram.com/souq.300"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold text-xs rounded-full transition shadow-sm"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>انستغرام: @souq.300</span>
          </a>
        </div>

        {/* حقوق النشر */}
        <div className="text-[10px] sm:text-[11px] text-slate-500 pt-3 border-t border-white/5 w-full">
          © 2026 متجر سوق هبة الإلكتروني. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
