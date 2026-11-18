import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle, Package } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export default function QuickRestockModal({ product, onClose }) {
  const { adjustStock } = useShop();
  const [quantity, setQuantity] = useState(10);
  const [reason, setReason] = useState('شحنة جديدة من المورد');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) {
      alert('يرجى إدخال عدد قطع صحيح موجب لإضافته للمخزون.');
      return;
    }

    setIsSubmitting(true);
    try {
      await adjustStock(product.id, qty, reason, note);
      onClose();
    } catch (err) {
      alert(err.message || 'فشل تحديث المخزون');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resultingStock = product.stock + (parseInt(quantity, 10) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 text-right">
        {/* رأس النافذة */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm sm:text-base">تزويد مخزون المنتج</h3>
              <p className="text-xs text-slate-500 font-mono">كود: {product.sku}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* نموذج الإدخال */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* ملخص المنتج المستهدف */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-100 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>الرصيد الحالي: <strong className="text-slate-900">{product.stock} قطعة</strong></span>
                <span>•</span>
                <span>حد التنبيه: {product.lowStockThreshold}</span>
              </div>
            </div>
          </div>

          {/* الكمية المراد إضافتها */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              عدد القطع المضافة للمخزون *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
              />
              <div className="flex gap-1">
                {[5, 10, 25, 50].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setQuantity(val)}
                    className="px-2.5 py-2 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* سبب التوريد */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              مصدر / سبب تزويد المخزون
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            >
              <option value="شحنة جديدة من المورد">وصول شحنة جديدة من المورد</option>
              <option value="تزويد مستودعي دوري">تزويد مستودعي دوري</option>
              <option value="جرد وتصحيح رصيد">جرد وتصحيح رصيد المستودع</option>
              <option value="مرتجع من عميل">إرجاع بضاعة من عميل</option>
              <option value="دفعة إنتاج محلية">دفعة تصنيع أو إنتاج جديدة</option>
            </select>
          </div>

          {/* ملاحظة أو رقم بوليصة التوريد */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ملاحظة أو رقم أمر الشراء (اختياري)
            </label>
            <input
              type="text"
              placeholder="مثال: فاتورة توريد رقم 8492"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {/* معاينة الرصيد الجديد */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center justify-between text-xs text-emerald-900">
            <span>الرصيد بعد التزويد:</span>
            <span className="font-black text-sm text-emerald-800 font-mono">
              {product.stock} + {quantity || 0} = {resultingStock} قطعة
            </span>
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري التحديث...' : 'تأكيد التزويد'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
