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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" dir="rtl">
      {/* البانر الترويجي */}
      <HeroBanner />

      {/* شريط التصنيفات السريع */}
      <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              {cat === 'جميع الأقسام' && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* شريط التحكم: القسم الحالي، فلاتر التوفر، الترتيب */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900">
            {selectedCategory}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            عرض {filteredProducts.length} من أصل {products.length} منتج
            {searchQuery && ` مطابقة للبحث عن "${searchQuery}"`}
          </p>
        </div>

        {/* قوائم التصفية والفرز */}
        <div className="flex flex-wrap items-center gap-3">
          {/* فلتر توفر المخزون */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-bold">حالة التوفر:</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">جميع المنتجات</option>
              <option value="in">المتوفر فقط</option>
              <option value="low">تنبيهات نقص المخزون</option>
              <option value="out">نفد من المخزون</option>
            </select>
          </div>

          {/* الترتيب */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-bold">الترتيب حسب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="featured">المميز والأحدث</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
              <option value="stock-desc">الأكثر توفراً في المخزون</option>
              <option value="name">اسم المنتج أبجدياً</option>
            </select>
          </div>

          {/* زر إعادة ضبط الفلاتر */}
          {isFiltered && (
            <button
              onClick={resetAllFilters}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-rose-600 font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>
      </div>

      {/* شبكة المنتجات */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-600" />
          <p className="text-xs font-bold">جاري تحميل منتجات سوق هبة...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-500 max-w-lg mx-auto my-8">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg mb-1">لا توجد منتجات مطابقة لخيارات البحث</h3>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
