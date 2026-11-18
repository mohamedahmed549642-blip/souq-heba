import React from 'react';
import {
  Sparkles,
  SlidersHorizontal,
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
    setSelectedCategory('جميع الأقسام');
    setStockFilter('all');
    setSortBy('featured');
    setSearchQuery('');
  };

  const isFiltered =
    selectedCategory !== 'جميع الأقسام' ||
    stockFilter !== 'all' ||
    sortBy !== 'featured' ||
    searchQuery.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6" dir="rtl">
      {/* البانر الترويجي */}
      <HeroBanner />

      {/* شريط التصنيفات السريع للأجهزة المحمولة والديسكتوب */}
      <div className="mb-4 sm:mb-6 -mx-3 px-3 sm:mx-0 sm:px-0 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0 ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-gradient-to-r from-[#0c2340] to-[#133e7c] text-white shadow-md shadow-blue-900/20 ring-2 ring-orange-500/50'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-400 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              {cat === 'جميع الأقسام' && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* شريط التحكم: القسم الحالي، فلاتر التوفر، الترتيب */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-sm sm:text-lg font-black text-slate-900">
            {selectedCategory}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
            عرض {filteredProducts.length} من أصل {products.length} منتج
            {searchQuery && ` مطابقة للبحث عن "${searchQuery}"`}
          </p>
        </div>

        {/* قوائم التصفية والفرز */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* فلتر توفر المخزون */}
          <div className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start gap-1.5 bg-slate-50 border border-slate-200 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs">
            <div className="flex items-center gap-1 text-slate-500 font-bold shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>المخزون:</span>
            </div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-[11px] sm:text-xs"
            >
              <option value="all">الكل</option>
              <option value="in">المتوفر فقط</option>
              <option value="low">قارب على النفاد</option>
              <option value="out">نفد من المخزون</option>
            </select>
          </div>

          {/* الترتيب */}
          <div className="flex-1 sm:flex-none flex items-center justify-between sm:justify-start gap-1.5 bg-slate-50 border border-slate-200 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs">
            <div className="flex items-center gap-1 text-slate-500 font-bold shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>الترتيب:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-[11px] sm:text-xs"
            >
              <option value="featured">الأحدث</option>
              <option value="price-asc">الأقل سعراً</option>
              <option value="price-desc">الأعلى سعراً</option>
              <option value="stock-desc">الأكثر توفراً</option>
              <option value="name">أبجدياً</option>
            </select>
          </div>

          {/* زر إعادة ضبط الفلاتر */}
          {isFiltered && (
            <button
              onClick={resetAllFilters}
              className="px-2.5 py-1.5 text-[11px] sm:text-xs text-slate-500 hover:text-rose-600 font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>إعادة ضبط</span>
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
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
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
