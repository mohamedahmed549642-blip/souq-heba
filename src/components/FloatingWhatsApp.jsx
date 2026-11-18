import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function FloatingWhatsApp() {
  const { isAdminRoute } = useShop();

  if (isAdminRoute) return null;

  const whatsappNumber = '201099298496';
  const defaultMessage = encodeURIComponent('مرحباً سوق هبة، أود الاستفسار عن المنتجات والعروض المتوفرة.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <aside
      className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 flex items-center gap-2 group transition-all duration-300 pointer-events-auto"
      dir="rtl"
      aria-label="زر محادثة واتساب السريع"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر واتساب"
        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_20px_rgba(16,185,129,0.45)] ring-2 ring-white/80 transition-transform transform hover:scale-110 active:scale-95 cursor-pointer"
        title="تحدث مع خدمة عملاء سوق هبة واتساب"
      >
        {/* تأثير النبض الضوئي اللطيف */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30 animate-ping" />
        <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
      </a>

      {/* شارة نصية مساعدة تظهر على أجهزة الكمبيوتر عند التمرير */}
      <span className="hidden sm:inline-block bg-[#071629]/95 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        تحدث معنا واتساب
      </span>
    </aside>
  );
}
