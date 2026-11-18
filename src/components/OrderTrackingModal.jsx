import React, { useState } from 'react';
import { X, Search, Package, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/format';

export default function OrderTrackingModal() {
  const { isTrackingOpen, setIsTrackingOpen, orders } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isTrackingOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const q = searchTerm.trim().toLowerCase();
    const found = orders.find(o =>
      o.id.toLowerCase() === q ||
      o.trackingNumber.toLowerCase() === q ||
      o.customer.phone.includes(q)
    );
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const stages = ['قيد الانتظار', 'قيد التجهيز', 'خرج للتوصيل', 'تم التسليم'];

  const getStageIndex = (status) => {
    if (status.includes('ملغي')) return -1;
    if (status === 'قيد الانتظار' || status === 'Pending') return 0;
    if (status === 'قيد التجهيز' || status === 'Processing') return 1;
    if (status === 'خرج للتوصيل' || status === 'تم الشحن' || status === 'Shipped') return 2;
    if (status === 'تم التسليم' || status === 'Delivered') return 3;
    return 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col text-right">
        {/* الرأس */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">تتبع طلبك وشحنتك</h2>
              <p className="text-xs text-slate-500">حالة الشحن والتسليم اللحظية لطلبك</p>
            </div>
          </div>
          <button
            onClick={() => setIsTrackingOpen(false)}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* المحتوى */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* حقل البحث */}
          <form onSubmit={handleSearch}>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              أدخل رقم الطلب، كود التتبع، أو رقم الجوال:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="مثال: SH-2026-9401 أو ORD-9401"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                تتبع الآن
              </button>
            </div>
          </form>

          {/* اقتراحات الطلبات السريعة */}
          {orders.length > 0 && !hasSearched && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                طلبات سريعة للمعاينة:
              </span>
              <div className="flex flex-wrap gap-2">
                {orders.slice(0, 3).map(o => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setSearchTerm(o.trackingNumber);
                      setSearchedOrder(o);
                      setHasSearched(true);
                    }}
                    className="text-xs bg-white hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 font-mono px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    {o.trackingNumber} ({o.customer.name})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* نتيجة البحث */}
          {hasSearched && (
            searchedOrder ? (
              <div className="border border-slate-200 rounded-2xl p-5 space-y-5 bg-white">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 font-mono">رقم الطلب {searchedOrder.id}</span>
                    <h3 className="text-sm font-black text-slate-900 font-mono">
                      كود التتبع: {searchedOrder.trackingNumber}
                    </h3>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    searchedOrder.status === 'تم التسليم' || searchedOrder.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : searchedOrder.status.includes('ملغي')
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {searchedOrder.status}
                  </span>
                </div>

                {/* شريط مراحل التتبع */}
                {!searchedOrder.status.includes('ملغي') ? (
                  <div>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold text-slate-500 mb-2">
                      <span className={getStageIndex(searchedOrder.status) >= 0 ? 'text-emerald-700 font-black' : ''}>تم الطلب</span>
                      <span className={getStageIndex(searchedOrder.status) >= 1 ? 'text-emerald-700 font-black' : ''}>قيد التجهيز</span>
                      <span className={getStageIndex(searchedOrder.status) >= 2 ? 'text-emerald-700 font-black' : ''}>خرج للتوصيل</span>
                      <span className={getStageIndex(searchedOrder.status) >= 3 ? 'text-emerald-700 font-black' : ''}>تم التسليم</span>
                    </div>

                    <div className="relative flex items-center justify-between">
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
                      <div
                        className="absolute right-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 transition-all duration-500 z-0"
                        style={{ width: `${(getStageIndex(searchedOrder.status) / 3) * 100}%` }}
                      />

                      {stages.map((stg, i) => {
                        const passed = i <= getStageIndex(searchedOrder.status);
                        return (
                          <div
                            key={stg}
                            className={`w-7 h-7 rounded-full z-10 flex items-center justify-center border-2 text-xs ${
                              passed
                                ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                                : 'bg-white border-slate-300 text-slate-400'
                            }`}
                          >
                            {passed ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>تم إلغاء هذا الطلب وإعادة القطع المحجوزة إلى المخزون.</span>
                  </div>
                )}

                {/* بيانات العميل والتسليم */}
                <div className="text-xs bg-slate-50 p-3.5 rounded-xl space-y-1 text-slate-600">
                  <p><strong>اسم العميل:</strong> {searchedOrder.customer.name}</p>
                  <p><strong>عنوان التسليم:</strong> {searchedOrder.customer.address}</p>
                  <p><strong>طريقة الدفع:</strong> {searchedOrder.paymentMethod}</p>
                  <p><strong>المبلغ المطلوب تحصيله كاش:</strong> <strong className="text-slate-900">{formatCurrency(searchedOrder.total)}</strong></p>
                </div>

                {/* أصناف الطلب */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    المنتجات المحجوزة ({searchedOrder.items.length})
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                    {searchedOrder.items.map(item => (
                      <div key={item.id} className="p-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                          )}
                          <span className="font-bold text-slate-800">{item.name} (×{item.quantity})</span>
                        </div>
                        <span className="font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold">لم نتمكن من العثور على طلب مطابق لـ "{searchTerm}". يرجى التأكد من الرقم أو كود التتبع.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
