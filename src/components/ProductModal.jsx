import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Truck, RefreshCw, Star, AlertTriangle, CheckCircle, Trash2, Plus, Minus, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/format';

export default function ProductModal() {
  const {
    selectedProductForModal,
    setSelectedProductForModal,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    cart
  } = useShop();

  const [quantity, setQuantity] = useState(1);

  if (!selectedProductForModal) return null;
  const product = selectedProductForModal;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const currentCartItem = cart.find(i => i.id === product.id);
  const inCartQty = currentCartItem ? currentCartItem.quantity : 0;
  const remainingCanAdd = Math.max(0, product.stock - inCartQty);
  const isMaxInCart = inCartQty >= product.stock;

  const currentPrice = product.salePrice !== null ? product.salePrice : product.price;

  const handleIncrement = () => {
    if (quantity < remainingCanAdd) {
      setQuantity(q => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (quantity > remainingCanAdd) {
      alert(`لا يمكن إضافة ${quantity} قطع. المتوفر الإضافي لك في السلة هو ${remainingCanAdd} قطع فقط.`);
      return;
    }
    addToCart(product, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
      <div className="relative w-full max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row max-h-[92vh] sm:max-h-[90vh]">
        {/* زر الإغلاق */}
        <button
          onClick={() => setSelectedProductForModal(null)}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 shadow-md flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* قسم صورة المنتج */}
        <div className="md:w-1/2 bg-slate-50 relative flex items-center justify-center p-4 sm:p-6 border-b md:border-b-0 md:border-l border-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full max-h-[220px] sm:max-h-[350px] object-cover rounded-2xl shadow-md ${
              isOutOfStock ? 'grayscale' : ''
            }`}
          />
          {product.salePrice && (
            <span className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-rose-500 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl shadow">
              عرض خاص
            </span>
          )}

          {inCartQty > 0 && (
            <span className="absolute bottom-4 right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>مضاف في سلتك ({inCartQty})</span>
            </span>
          )}
        </div>

        {/* تفاصيل المنتج */}
        <div className="md:w-1/2 p-4 sm:p-8 flex flex-col overflow-y-auto text-right">
          {/* القسم وكود SKU */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="bg-orange-50 text-orange-900 border border-orange-200/80 font-bold px-2.5 py-1 rounded-lg">
              {product.category}
            </span>
            <span className="font-mono text-slate-400">كود المنتج: {product.sku}</span>
          </div>

          {/* اسم المنتج */}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
            {product.name}
          </h2>
          {product.nameEn && (
            <p className="text-xs font-semibold text-slate-400 font-mono mb-3">
              {product.nameEn}
            </p>
          )}

          {/* التقييم */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating}</span>
            <span className="text-xs text-slate-400">({product.reviewsCount} تقييم حقيقي من العملاء)</span>
          </div>

          {/* السعر والمخزون */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {formatCurrency(currentPrice)}
                </span>
                {product.salePrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* شارة التوفر */}
            <div className="text-xs">
              {isOutOfStock ? (
                <span className="text-rose-600 font-bold flex items-center gap-1.5">
                  <X className="w-4 h-4" /> نفد من المخزون حالياً
                </span>
              ) : isLowStock ? (
                <span className="text-amber-600 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> مخزون محدود: متبقي {product.stock} قطع فقط في المستودع!
                </span>
              ) : (
                <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> متوفر في المخزون ({product.stock} قطع جاهزة للشحن)
                </span>
              )}
            </div>
          </div>

          {/* قسم تأكيد الاختيار والحذف المباشر إذا كان المنتج مضافاً في السلة */}
          {inCartQty > 0 && (
            <div className="bg-orange-50/90 border border-orange-200/90 rounded-2xl p-3.5 mb-4 shadow-xs animate-in fade-in">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-black shrink-0 shadow-sm">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      هذا المنتج موجود في سلتك ({inCartQty} قطع)
                    </h4>
                    <p className="text-[11px] text-orange-700 font-semibold">
                      إجمالي سعره بالسلة: {formatCurrency(currentPrice * inCartQty)}
                    </p>
                  </div>
                </div>

                {/* زر حذف ما تم اختياره مباشرة من صفحة المنتج */}
                <button
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                  className="px-3 py-1.5 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95 shrink-0"
                  title="حذف هذا المنتج بالكامل من السلة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف من السلة</span>
                </button>
              </div>

              {/* أزرار تعديل الكمية السريعة لما تم طلبه */}
              <div className="mt-3 pt-2.5 border-t border-orange-200/60 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">تعديل الكمية في سلتك:</span>
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-orange-200 shadow-xs">
                  <button
                    onClick={() => {
                      if (inCartQty <= 1) {
                        removeFromCart(product.id);
                      } else {
                        updateCartQuantity(product.id, inCartQty - 1);
                      }
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 transition active:scale-90 cursor-pointer"
                    title={inCartQty <= 1 ? "حذف من السلة" : "إنقاص قطعة"}
                  >
                    {inCartQty <= 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-500" /> : <Minus className="w-3.5 h-3.5" />}
                  </button>

                  <span className="w-7 text-center font-black text-sm text-orange-600">
                    {inCartQty}
                  </span>

                  <button
                    onClick={() => updateCartQuantity(product.id, inCartQty + 1)}
                    disabled={isMaxInCart}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition active:scale-90 cursor-pointer"
                    title={isMaxInCart ? "وصلت لأقصى مخزون" : "زيادة قطعة"}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* الوصف */}
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            <p>{product.description}</p>
          </div>

          {/* أزرار إضافة كميات جديدة */}
          <div className="mt-auto">
            {!isOutOfStock && remainingCanAdd > 0 ? (
              <div className="flex items-center gap-3">
                {/* عداد الكمية المراد إضافتها */}
                <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= remainingCanAdd}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer text-xs sm:text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {inCartQty > 0 ? `إضافة ${quantity} أخرى للسلة` : `إضافة ${quantity} للسلة`} • {formatCurrency(currentPrice * quantity)}
                  </span>
                </button>
              </div>
            ) : isOutOfStock ? (
              <div className="w-full py-3 bg-slate-100 text-slate-500 font-bold rounded-xl text-center text-sm border border-slate-200">
                هذا المنتج غير متوفر في المخزون حالياً
              </div>
            ) : (
              <div className="w-full py-2.5 bg-amber-50 text-amber-800 font-bold rounded-xl text-center text-xs sm:text-sm border border-amber-200">
                لقد حجزت كل الكمية المتوفرة في المخزون ({product.stock} قطع) في سلتك
              </div>
            )}

            {/* شارات الضمان */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>شحن وتوصيل فوري</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>أصالة مضمونة 100%</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="w-4 h-4 text-emerald-600" />
                <span>استرجاع سهل 14 يوماً</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
