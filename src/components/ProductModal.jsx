import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Truck, RefreshCw, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/format';

export default function ProductModal() {
  const { selectedProductForModal, setSelectedProductForModal, addToCart, cart } = useShop();
  const [quantity, setQuantity] = useState(1);

  if (!selectedProductForModal) return null;
  const product = selectedProductForModal;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const currentCartItem = cart.find(i => i.id === product.id);
  const inCartQty = currentCartItem ? currentCartItem.quantity : 0;
  const remainingCanAdd = Math.max(0, product.stock - inCartQty);

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
    const success = addToCart(product, quantity);
    if (success) {
      setSelectedProductForModal(null);
    }
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
            className={`w-full max-h-[200px] sm:max-h-[350px] object-cover rounded-2xl shadow-md ${
              isOutOfStock ? 'grayscale' : ''
            }`}
          />
          {product.salePrice && (
            <span className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-rose-500 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl shadow">
              عرض خاص
            </span>
          )}
        </div>

        {/* تفاصيل المنتج */}
        <div className="md:w-1/2 p-4 sm:p-8 flex flex-col overflow-y-auto text-right">
          {/* القسم وكود SKU */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">
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

          {/* السعر */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatCurrency(currentPrice)}
            </span>
            {product.salePrice && (
              <span className="text-base text-slate-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* صندوق تتبع المخزون اللحظي */}
          <div className="mb-4 p-3.5 rounded-2xl border text-xs flex items-center justify-between">
            <div>
              <span className="font-bold block text-slate-800 mb-0.5">حالة المخزون المتوفر:</span>
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

            {inCartQty > 0 && (
              <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg">
                في سلتك: {inCartQty}
              </span>
            )}
          </div>

          {/* الوصف */}
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            <p>{product.description}</p>
          </div>

          {/* أزرار الإجراءات */}
          <div className="mt-auto">
            {!isOutOfStock && remainingCanAdd > 0 ? (
              <div className="flex items-center gap-3">
                {/* عداد الكمية */}
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
                  <span>إضافة {quantity} للسلة • {formatCurrency(currentPrice * quantity)}</span>
                </button>
              </div>
            ) : isOutOfStock ? (
              <div className="w-full py-3 bg-slate-100 text-slate-500 font-bold rounded-xl text-center text-sm border border-slate-200">
                هذا المنتج غير متوفر في المخزون حالياً
              </div>
            ) : (
              <div className="w-full py-3 bg-amber-50 text-amber-800 font-bold rounded-xl text-center text-sm border border-amber-200">
                لقد أضفت كل الكمية المتوفرة في المخزون ({product.stock} قطع) إلى سلتك
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
