import React from 'react';
import { Store, ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Footer() {
  const { openAdminPortal, setIsTrackingOpen, setSelectedCategory } = useShop();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16" dir="rtl">
      {/* المزايا الرئيسية */}
      <div className="border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-right">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">شحن لكافة محافظات مصر</h5>
              <p className="text-[11px] text-slate-400">توصيل لباب بيتك بجميع الـ 27 محافظة وتتبع لحظي.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">الدفع كاش عند الاستلام</h5>
              <p className="text-[11px] text-slate-400">معاينة وفحص المنتج قبل دفع المبلغ للمندوب.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">استرجاع سهل ومريح</h5>
              <p className="text-[11px] text-slate-400">ضمان استبدال أو استرجاع خلال 14 يوماً بكل يسر.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">حجز فوري من المخزون</h5>
              <p className="text-[11px] text-slate-400">دفع آمن وحجز مؤكد للقطع من المستودع مباشرة.</p>
            </div>
          </div>
        </div>
      </div>

      {/* الروابط وأقسام المتجر */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-right">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Store className="w-4 h-4 text-amber-300" />
            </div>
            <span className="font-black text-base text-white">سوق هبة | Souq Heba</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            وجهتك الإلكترونية المتميزة لأفخر دهن العود والبخور، والعبايات المطرزة، والأجهزة الحديثة وأطيب المأكولات التراثية.
          </p>
          <div className="text-[11px] text-slate-500">
            © 2026 سوق هبة للتجارة الإلكترونية. جميع الحقوق محفوظة.
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">تشكيلات المتجر</h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setSelectedCategory('عطور وعود')}
                className="hover:text-emerald-400 transition cursor-pointer"
              >
                عطور ملكية ودهن عود نقي
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedCategory('أزياء وعبايات')}
                className="hover:text-emerald-400 transition cursor-pointer"
              >
                عبايات حرير وشالات كشمير
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedCategory('إلكترونيات')}
                className="hover:text-emerald-400 transition cursor-pointer"
              >
                ساعات ذكية وسماعات لاسلكية
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedCategory('قهوة ومأكولات فاخرة')}
                className="hover:text-emerald-400 transition cursor-pointer"
              >
                قهوة عربية أصيلة وتمور ملكية
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">خدمة العملاء</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => setIsTrackingOpen(true)} className="hover:text-emerald-400 transition cursor-pointer">
                تتبع مسار شحنتي
              </button>
            </li>
            <li><span className="hover:text-white cursor-pointer">سياسة الشحن والتوصيل</span></li>
            <li><span className="hover:text-white cursor-pointer">الاستبدال والاسترجاع</span></li>
            <li><span className="hover:text-white cursor-pointer">خدمة العملاء واتساب: 4567 123 50 971+</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">إدارة المتجر والمخزون</h4>
          <p className="text-xs text-slate-400 mb-3">
            منطقة مخصصة للمشرفين لمتابعة حركة المخزون، تزويد المنتجات ومعالجة طلبات العملاء (محمية بكلمة مرور).
          </p>
          <button
            onClick={openAdminPortal}
            className="w-full py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold rounded-xl border border-emerald-500/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>تسجيل دخول الإدارة والمخزون</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
