import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function FloatingWhatsApp() {
  const { cartTotalItems, isAdminRoute } = useShop();

  if (isAdminRoute) return null;

  const whatsappNumber = '201099298496';
  const defaultMessage = encodeURIComponent('مرحباً سوق هبة، أود الاستفسار عن المنتجات والعروض المتوفرة.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className={`fixed left-4 z-40 flex items-center gap-2 group transition-all duration-300 ${
        cartTotalItems > 0 ? 'bottom-20 sm:bottom-6' : 'bottom-5 sm:bottom-6'
      }`}
    >
      <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition transform hover:scale-110 active:scale-95 cursor-pointer">
        {/* Subtle Ping Pulse */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30 animate-ping" />
        <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
      </div>

      {/* Pill label visible on desktop hover or subtle badge */}
      <span className="hidden sm:inline-block bg-[#071629]/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        تحدث معنا واتساب
      </span>
    </a>
  );
}
