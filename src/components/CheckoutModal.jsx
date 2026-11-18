import React, { useState } from 'react';
import { X, CheckCircle, Truck, Banknote, ShieldCheck, ArrowLeft, Printer, MapPin, Phone } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { EGYPT_GOVERNORATES } from '../data/egyptGovernorates';
import { formatCurrency } from '../utils/format';

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, placeOrder, setIsTrackingOpen } = useShop();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'القاهرة',
    address: '',
    paymentMethod: 'الدفع عند الاستلام نقداً (كاش)',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isCheckoutOpen) return null;

  const subtotal = cart.reduce((sum, item) => {
    const price = item.salePrice !== null ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal >= 1000 || subtotal === 0 ? 0 : 50;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMessage('يرجى تعبئة الاسم الكامل، رقم الجوال المصري، وعنوان التوصيل بالتفصيل.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || 'customer@souqheba.com',
          address: `${formData.address}، محافظة ${formData.city}، مصر`
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity
        })),
        paymentMethod: 'الدفع عند الاستلام نقداً (كاش)',
        notes: formData.notes,
        discount: 0,
        shipping: shipping
      };

      const order = await placeOrder(orderPayload);
      setCompletedOrder(order);

      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }
    } catch (err) {
      setErrorMessage(err.message || 'حدث خطأ أثناء إتمام الطلب، يرجى التحقق من توفر المخزون.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setErrorMessage(null);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col text-right">
        {/* رأس النافذة */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {completedOrder ? '🎉 تم تأكيد طلبك بنجاح!' : 'شحن لجميع محافظات مصر • الدفع عند الاستلام نقداً (كاش)'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {completedOrder
                ? 'تم حجز المنتجات من المستودع وجاري تجهيز الشحنة لمندوب التوصيل.'
                : 'أدخل بيانات التوصيل في محافظتك - والدفع كاش عند استلام ومعاينة الشحنة.'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* محتوى النافذة */}
        <div className="flex-1 overflow-y-auto p-6">
          {completedOrder ? (
            /* شاشة إيصال الطلب الناجح */
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">
                  شكراً لك، {completedOrder.customer.name}!
                </h3>
                <p className="text-sm text-slate-600">
                  تم استلام طلبك وتأكيده وحجز المخزون مباشرة، وسيتصل بك مندوب الشحن قبل التوصيل.
                </p>
              </div>

              {/* بطاقة معلومات التتبع */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">رقم الطلب</span>
                    <strong className="text-slate-900 text-sm font-mono">{completedOrder.id}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">كود التتبع</span>
                    <strong className="text-emerald-700 text-sm font-mono font-black">
                      {completedOrder.trackingNumber}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">طريقة الدفع</span>
                    <strong className="text-emerald-700 text-xs font-black flex items-center gap-1">
                      <Banknote className="w-3.5 h-3.5" />
                      <span>كاش عند الاستلام</span>
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">المبلغ المستحق للدفع</span>
                    <strong className="text-slate-900 text-sm font-black">
                      {formatCurrency(completedOrder.total)}
                    </strong>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 text-xs">
                  <span className="text-slate-400 block font-medium">عنوان التسليم بمصر</span>
                  <span className="text-slate-800 font-bold">{completedOrder.customer.address}</span>
                  <span className="text-slate-500 block mt-0.5">رقم التواصل: {completedOrder.customer.phone}</span>
                </div>
              </div>

              {/* قائمة المنتجات المطلوبة */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  المنتجات المحجوزة في الطلب ({completedOrder.items.length})
                </h4>
                <div className="border border-slate-100 rounded-2xl divide-y divide-slate-100 overflow-hidden">
                  {completedOrder.items.map(item => (
                    <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <span className="text-slate-400">الكمية: {item.quantity} × {formatCurrency(item.price)}</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    setIsTrackingOpen(true);
                  }}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>تتبع حالة هذا الطلب مباشرة</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الفاتورة</span>
                </button>
              </div>
            </div>
          ) : (
            /* نموذج الدفع والشحن */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold">
                  {errorMessage}
                </div>
              )}

              {/* 1. بيانات العميل */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  ١. بيانات المشتري ورقم التواصل
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      الاسم بالكامل *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="مثال: أحمد محمود إبراهيم"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      رقم الهاتف المحمول (واتساب للمندوب) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="01012345678 أو 011 أو 012"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono text-left"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      البريد الإلكتروني (اختياري)
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-left font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 2. عنوان التوصيل داخل جمهورية مصر العربية */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>٢. عنوان وجهة التوصيل داخل مصر</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    متاح لجميع الـ 27 محافظة
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      المحافظة المصرية *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-bold text-slate-800"
                    >
                      {EGYPT_GOVERNORATES.map(gov => (
                        <option key={gov} value={gov}>
                          محافظة {gov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      المنطقة / الشارع ورقم العمارة والشقة *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="مثال: 15 شارع عباس العقاد، متفرع من النصر، عمارة 4 شقة 6"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      علامة مميزة أو تعليمات لمندوب التوصيل (اختياري)
                    </label>
                    <input
                      type="text"
                      name="notes"
                      placeholder="بجوار مسجد / صيدلية كذا، الاتصال قبل الوصول بنصف ساعة..."
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* 3. طريقة الدفع: كاش فقط حصرياً */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  ٣. طريقة الدفع المعتمدة (نقداً فقط)
                </h3>
                
                {/* بطاقة الدفع كاش الحصرية */}
                <div className="p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-50/70 shadow-sm flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-slate-900">
                        الدفع عند الاستلام نقداً (كاش فقط)
                      </span>
                      <span className="bg-emerald-200 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                        متاح ومضمون
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      لا تحتاج لدفع أي مبالغ الآن. ادفع كامل قيمة الطلب نقداً لمندوب الشحن عند وصوله لباب بيتك وبعد استلام شحنتك ومعاينتها.
                    </p>
                  </div>
                </div>
              </div>

              {/* ملخص الطلب */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold text-slate-700">المنتجات المطلوبة ({cart.length})</span>
                  <span className="text-emerald-700 font-bold">خصم وحجز فوري من المستودع</span>
                </div>
                <div className="space-y-1 max-h-24 overflow-y-auto text-xs text-slate-600 divide-y divide-slate-100">
                  {cart.map(item => (
                    <div key={item.id} className="pt-1 flex justify-between">
                      <span className="truncate pl-2">{item.name} × {item.quantity}</span>
                      <span className="font-bold text-slate-800 shrink-0">
                        {formatCurrency((item.salePrice || item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 mt-3 pt-2 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-800">المبلغ المستحق للدفع نقداً (كاش)</span>
                  <span className="text-lg font-black text-slate-900">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* زر الإرسال */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer text-sm"
              >
                {isSubmitting ? (
                  <span>جاري حجز المخزون وتأكيد الطلب...</span>
                ) : (
                  <>
                    <span>تأكيد الطلب الآن (الدفع كاش عند الاستلام) • {formatCurrency(total)}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
