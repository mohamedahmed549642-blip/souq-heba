import React from 'react';
import { ShieldCheck, Truck, RotateCcw, PackageCheck, MessageCircle, Instagram, Phone } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Footer() {
  const { setSelectedCategory } = useShop();

  return (
    <footer className="bg-[#071629] text-slate-400 text-xs border-t border-slate-800 mt-16" dir="rtl">
      {/* المزايا الرئيسية الأربعة */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-right">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">شحن لكافة محافظات مصر</h5>
              <p className="text-[11px] text-slate-400">توصيل سريع لباب بيتك بجميع الـ 27 محافظة.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">الدفع كاش عند الاستلام</h5>
              <p className="text-[11px] text-slate-400">معاينة وفحص المنتج وتجربته قبل دفع أي مليم.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">استرجاع واستبدال 14 يوماً</h5>
              <p className="text-[11px] text-slate-400">ضمان شامل معتمد واستبدال فوري بكل يسر وسهولة.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">أجهزة وشواحن أصلية 100%</h5>
              <p className="text-[11px] text-slate-400">فحص دقيق لكافة القطع قبل الشحن والتسليم.</p>
            </div>
          </div>
        </div>
      </div>

      {/* الروابط وأقسام المتجر */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-right">
        {/* عن المتجر والهوية */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-md ring-2 ring-orange-500/30 shrink-0">
              <img
                src="/logo.png"
                alt="سوق هبة"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-black text-base text-white block">سوق هبة | Souq Heba</span>
              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">ELECTRONICS STORE</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            متجر سوق هبة المعتمد لأحدث الشواحن والباور بانك السريع، الساعات والسماعات الذكية، وأجهزة العناية الشخصية، وزيت زيتون سيناء الطبيعي 100%.
          </p>
          <div className="text-[11px] text-slate-500">
            © 2026 سوق هبة للتجارة الإلكترونية. جميع الحقوق محفوظة.
          </div>
        </div>

        {/* تشكيلات المتجر */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">تشكيلات المتجر</h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setSelectedCategory('إلكترونيات وشواحن')}
                className="hover:text-orange-400 transition cursor-pointer"
              >
                باور بانك وشواحن فائقة السرعة
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedCategory('ساعات وسماعات ذكية')}
                className="hover:text-orange-400 transition cursor-pointer"
              >
                ساعات Ultra وسماعات AirPods
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedCategory('عناية شخصية وحلاقة')}
                className="hover:text-orange-400 transition cursor-pointer"
              >
                أجهزة Flawless وماكينات الحلاقة
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedCategory('منتجات سيناء الطبيعية')}
                className="hover:text-orange-400 transition cursor-pointer"
              >
                زيت زيتون بكر طبيعي من سيناء
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedCategory('إكسسوارات وهدايا')}
                className="hover:text-orange-400 transition cursor-pointer"
              >
                كابلات شحن مصفحة وإكسسوارات
              </button>
            </li>
          </ul>
        </div>

        {/* خدمة العملاء والسياسات */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">خدمة العملاء</h4>
          <ul className="space-y-2 text-slate-400">
            <li><span>توصيل سريع لكافة الـ 27 محافظة</span></li>
            <li><span>الدفع نقداً عند الاستلام بعد المعاينة</span></li>
            <li><span>حق فحص وتجربة الشحنة قبل الدفع</span></li>
            <li><span>ضمان الاستبدال والاسترجاع 14 يوماً</span></li>
            <li><span>كود الخصم الفوري: HEBA10</span></li>
          </ul>
        </div>

        {/* قنوات التواصل الرسمية */}
        <div>
          <h4 className="font-bold text-white text-sm mb-3">تواصل معنا مباشرة</h4>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            فريق سوق هبة متاح للرد على استفساراتكم ومتابعة الشحنات وتأكيد الطلبات عبر واتساب وانستغرام:
          </p>
          <div className="space-y-2">
            {/* زر واتساب الرسمي */}
            <a
              href="https://wa.me/201099298496"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب: 01099298496</span>
            </a>

            {/* حساب انستغرام */}
            <a
              href="https://instagram.com/souq.300"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow transition"
            >
              <Instagram className="w-4 h-4" />
              <span>انستغرام: @souq.300</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}