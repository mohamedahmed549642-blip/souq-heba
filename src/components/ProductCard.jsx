import React from 'react';
import { ShoppingBag, Eye, Star, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/format';

export default function ProductCard({ product }) {
  const { addToCart, setSelectedProductForModal, cart } = useShop();

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const cartItem = cart.find(item => item.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isMaxInCart = inCartQty >= product.stock;

  const currentPrice = product.salePrice !== null ? product.salePrice : product.price;
  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-orange-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative text-right" dir="rtl">
      {/* شارة الخصم */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-start">
        {discountPercent > 0 && (
          <span className="bg-rose-500 text-white text-[9px] sm:text-[11px] font-extrabold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm">
            خصم {discountPercent}%
          </span>
        )}
      </div>

      {/* شارة حالة المخزون */}
      <div className="absolute top-2 left-2 z-10">
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1 bg-rose-600/90 text-white text-[9px] sm:text-[11px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm backdrop-blur-sm">
            <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">نفد من المخزون</span>
            <span className="sm:hidden">نفد</span>
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[9px] sm:text-[11px] font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm animate-pulse">
            <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>متبقي {product.stock}!</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-emerald-600/90 text-white text-[9px] sm:text-[11px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md sm:rounded-lg shadow-sm backdrop-blur-sm">
            <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-200" />
            <span className="hidden sm:inline">متوفر ({product.stock})</span>
            <span className="sm:hidden">{product.stock} ق</span>
          </span>
        )}
      </div>

      {/* صورة المنتج مع زر المعاينة السريعة */}
      <div
        className="relative aspect-square w-full overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => setSelectedProductForModal(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
            isOutOfStock ? 'grayscale opacity-70' : ''
          }`}
          loading="lazy"
        />

        {/* زر معاينة سريعة عند التحويم */}
        <div className="hidden sm:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductForModal(product);
            }}
            className="px-4 py-2 bg-white/95 hover:bg-white text-slate-900 text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition cursor-pointer"
          >
            <Eye className="w-4 h-4 text-orange-600" />
            <span>معاينة سريعة</span>
          </button>
        </div>
      </div>

      {/* بيانات المنتج */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        {/* القسم وكود SKU */}
        <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-slate-400 font-medium mb-1">
          <span className="text-[#0c2340] bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-md font-bold truncate max-w-[120px]">
            {product.category}
          </span>
          <span className="font-mono text-slate-400 hidden sm:inline">{product.sku}</span>
        </div>

        {/* اسم المنتج */}
        <h3
          onClick={() => setSelectedProductForModal(product)}
          className="font-bold text-slate-900 text-xs sm:text-sm hover:text-orange-600 transition line-clamp-2 min-h-[2rem] sm:min-h-0 cursor-pointer mb-1 leading-snug"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* التقييم */}
        <div className="flex items-center gap-1 mb-2 text-[10px] sm:text-xs">
          <div className="flex items-center text-amber-400">
            <Star className="w-3 h-3 fill-current" />
          </div>
          <span className="font-bold text-slate-800">{product.rating}</span>
          <span className="text-slate-400 hidden sm:inline">({product.reviewsCount} تقييم)</span>
        </div>

        {/* السعر وزر الشراء */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
          {/* الأسعار */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs sm:text-base font-black text-slate-900">
                {formatCurrency(currentPrice)}
              </span>
              {product.salePrice && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            {inCartQty > 0 && (
              <span className="text-[9px] sm:text-[10px] text-orange-600 font-bold block">
                في السلة: {inCartQty}
              </span>
            )}
          </div>

          {/* زر الإضافة للسلة */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock || isMaxInCart}
            className={`w-full sm:w-auto px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition shadow-sm ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : isMaxInCart
                ? 'bg-amber-100 text-amber-800 border border-amber-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/25 active:scale-95 cursor-pointer'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>
              {isOutOfStock ? 'نفد' : isMaxInCart ? 'بالسلة' : 'أضف'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
