import React, { useState } from 'react';
import { X, Trash2, ArrowLeft, ShoppingBag, ShieldCheck, Tag, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/format';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    setIsCheckoutOpen,
    products
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscountRate, setAppliedDiscountRate] = useState(0);
  const [couponMessage, setCouponMessage] = useState(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'HEBA10') {
      setAppliedDiscountRate(0.10);
      setCouponMessage({ type: 'success', text: 'تم تطبيق خصم 10% بنجاح!' });
    } else if (code === 'WELCOME') {
      setAppliedDiscountRate(0.15);
      setCouponMessage({ type: 'success', text: 'تم تطبيق خصم الترحيب 15%!' });
    } else {
      setCouponMessage({ type: 'error', text: 'رمز القسيمة غير صالح. جرب HEBA10' });
    }
  };

  const subtotal = cart.reduce((sum, item) => {
    const price = item.salePrice !== null ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  const discountAmount = subtotal * appliedDiscountRate;
  const shippingAmount = subtotal >= 1000 || subtotal === 0 ? 0 : 50;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingAmount);

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-slate-900/50 backdrop-blur-sm transition-opacity" dir="rtl">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
        {/* رأس السلة */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">حقيبة التسوق</h3>
              <p className="text-xs text-slate-500">
                {cart.length} {cart.length === 1 ? 'منتج' : 'منتجات'} في سلتك
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* قائمة منتجات السلة */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-lg mb-1">سلتك فارغة حالياً</h4>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
                تصفح تشكيلاتنا الأصيلة من العود والبخور والعبايات لإضافة منتجاتك المفضلة!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                تصفح المنتجات الآن
              </button>
            </div>
          ) : (
            cart.map(item => {
              const liveProduct = products.find(p => p.id === item.id) || item;
              const price = item.salePrice !== null ? item.salePrice : item.price;
              const isAtMaxStock = item.quantity >= liveProduct.stock;

              return (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-3.5 items-center">
                  {/* صورة مصغرة */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0"
                  />

                  {/* تفاصيل المنتج */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate mb-0.5">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="font-extrabold text-emerald-700">{formatCurrency(price)}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-slate-400">{item.sku}</span>
                    </div>

                    {/* عداد الكمية */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 text-xs">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded transition"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          disabled={isAtMaxStock}
                          className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded disabled:opacity-30 transition"
                        >
                          +
                        </button>
                      </div>

                      {isAtMaxStock && (
                        <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> أقصى كمية بالمخزون
                        </span>
                      )}
                    </div>
                  </div>

                  {/* إجمالي البند وزر الحذف */}
                  <div className="text-left flex flex-col items-end justify-between self-stretch">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-300 hover:text-rose-600 transition p-1 cursor-pointer"
                      title="حذف من السلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      {formatCurrency(price * item.quantity)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ملخص السلة وزر المتابعة */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70">
            {/* قسيمة الخصم */}
            <form onSubmit={handleApplyCoupon} className="mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="رمز القسيمة (جرب HEBA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pr-8 pl-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs uppercase font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  تطبيق
                </button>
              </div>
              {couponMessage && (
                <p className={`text-[11px] mt-1.5 font-bold ${
                  couponMessage.type === 'success' ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {couponMessage.text}
                </p>
              )}
            </form>

            {/* تفاصيل الحسابات */}
            <div className="space-y-1.5 text-xs text-slate-600 mb-4">
              <div className="flex justify-between">
                <span>المجموع الفرعي</span>
                <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              {appliedDiscountRate > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>خصم القسيمة ({(appliedDiscountRate * 100).toFixed(0)}%)</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>الشحن السريع (محافظات مصر)</span>
                <span className="font-semibold">
                  {shippingAmount === 0 ? (
                    <span className="text-emerald-600 font-bold uppercase text-[10px]">مجاني للطلبات فوق 1,000 ج.م</span>
                  ) : (
                    formatCurrency(shippingAmount)
                  )}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm sm:text-base font-black text-slate-900">
                <span>الإجمالي النهائي</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* زر متابعة الدفع */}
            <button
              onClick={handleProceedCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer text-sm"
            >
              <span>متابعة إتمام الطلب والدفع</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-500 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>الدفع عند الاستلام نقداً (كاش فقط) • شحن لجميع محافظات مصر</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
