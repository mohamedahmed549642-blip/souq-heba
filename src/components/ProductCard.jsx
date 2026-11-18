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
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative text-right" dir="rtl">
      {/* شارة الخصم */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-start">
        {discountPercent > 0 && (
          <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
            خصم {discountPercent}%
          </span>
        )}
      </div>

      {/* شارة حالة المخزون */}
      <div className="absolute top-3 left-3 z-10">
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1 bg-rose-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-sm">
            <XCircle className="w-3 h-3" />
            <span>نفد من المخزون</span>
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm animate-pulse">
            <AlertCircle className="w-3 h-3" />
            <span>متبقي {product.stock} فقط!</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-emerald-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-sm backdrop-blur-sm">
            <CheckCircle2 className="w-3 h-3 text-emerald-200" />
            <span>متوفر ({product.stock})</span>
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
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductForModal(product);
            }}
            className="px-4 py-2 bg-white/95 hover:bg-white text-slate-900 text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition cursor-pointer"
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>معاينة سريعة</span>
          </button>
        </div>
      </div>

      {/* بيانات المنتج */}
      <div className="p-4 flex flex-col flex-1">
        {/* القسم وكود SKU */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
            {product.category}
          </span>
          <span className="font-mono text-slate-400">{product.sku}</span>
        </div>

        {/* اسم المنتج */}
        <h3
          onClick={() => setSelectedProductForModal(product)}
          className="font-bold text-slate-900 text-sm hover:text-emerald-700 transition line-clamp-1 cursor-pointer mb-0.5"
          title={product.name}
        >
          {product.name}
        </h3>

        {product.nameEn && (
          <p className="text-[11px] text-slate-400 font-mono truncate mb-2">
            {product.nameEn}
          </p>
        )}

        {/* التقييم */}
        <div className="flex items-center gap-1.5 mb-3 text-xs">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-bold text-slate-800">{product.rating}</span>
          <span className="text-slate-400">({product.reviewsCount} تقييم)</span>
        </div>

        {/* السعر وزر الشراء */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* الأسعار */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                {formatCurrency(currentPrice)}
              </span>
              {product.salePrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            {inCartQty > 0 && (
              <span className="text-[10px] text-emerald-700 font-bold block">
                في سلتك: {inCartQty} قطعة
              </span>
            )}
          </div>

          {/* زر الإضافة للسلة */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock || isMaxInCart}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : isMaxInCart
                ? 'bg-amber-100 text-amber-800 border border-amber-200 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95 cursor-pointer'
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
