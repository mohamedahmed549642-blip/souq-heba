import React from 'react';
import {
  Sparkles,
  ArrowUpDown,
  ShoppingBag,
  RefreshCw
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import HeroBanner from './HeroBanner';
import ProductCard from './ProductCard';

export default function Storefront() {
  const {
    filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    stockFilter,
    setStockFilter,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    products,
    loading
  } = useShop();

  const resetAllFilters = () => {
    setSelectedCategory('الكل');
    setStockFilter('all');
    setSortBy('featured');
    setSearchQuery('');
  };

  const isFiltered =
    (selectedCategory !== 'الكل' && selectedCategory !== 'جميع الأقسام') ||
    stockFilter !== 'all' ||
    sortBy !== 'featured' ||
    searchQuery.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6" dir="rtl">
      {/* البانر الترويجي */}
      <HeroBanner />

      {/* شريط التصنيفات السريع للأجهزة المحمولة والديسكتوب */}
      <div id="products-section" className="scroll-mt-24 mb-4 sm:mb-6 -mx-3 px-3 sm:mx-0 sm:px-0 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
          {categories.map(cat => {
            const isSelected = selectedCategory.toLowerCase().trim() === cat.toLowerCase().trim();
            const isDeals = cat.includes('العروض');
            const isAll = cat === 'الكل' || cat === 'جميع الأقسام';

            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (stockFilter !== 'all') setStockFilter('all');
                }}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0 active:scale-95 ${
                  isSelected
                    ? isDeals
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 ring-2 ring-amber-300'
                      : 'bg-gradient-to-r from-[#0c2340] to-[#133e7c] text-white shadow-md shadow-blue-900/20 ring-2 ring-orange-500/50'
                    : isDeals
                    ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 hover:border-amber-400 font-black'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-400 hover:text-orange-600 hover:bg-slate-50'
                }`}
              >
                {isAll && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* شريط معلومات القسم والفرز - بتصميم عصري وأنيق وخفيف */}
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
            {selectedCategory}
          </h2>
          <span className="bg-orange-100 text-orange-700 text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-full">
            {filteredProducts.length} منتج
          </span>
          {searchQuery && (
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              (مطابقة للبحث "{searchQuery}")
            </span>
          )}
        </div>

        {/* أدوات الترتيب المدمجة */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 shadow-sm px-2.5 py-1.5 rounded-xl text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer text-xs pr-1"
            >
              <option value="featured">الأحدث</option>
              <option value="price-asc">الأقل سعراً</option>
              <option value="price-desc">الأعلى سعراً</option>
              <option value="stock-desc">الأكثر توفراً</option>
              <option value="name">أبجدياً</option>
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={resetAllFilters}
              className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-rose-600 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              title="إعادة ضبط الفلاتر"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* شبكة المنتجات (عمودين متناسقين في الهواتف الذكية) */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-600" />
          <p className="text-xs font-bold">جاري تحميل منتجات سوق هبة...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 sm:p-12 text-center text-slate-500 max-w-lg mx-auto my-8">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-1">لا توجد منتجات مطابقة لخيارات البحث</h3>
          <p className="text-xs text-slate-400 mb-6">
            جرب تعديل كلمات البحث، أو اختر قسماً آخر، أو قم بإلغاء فلتر التوفر.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-md shadow-orange-500/25 transition cursor-pointer active:scale-95"
          >
            إلغاء جميع الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
