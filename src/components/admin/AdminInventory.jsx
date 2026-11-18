import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Search,
  History,
  PlusCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatCurrency } from '../../utils/format';
import QuickRestockModal from './QuickRestockModal';

export default function AdminInventory() {
  const {
    products,
    inventoryLogs,
    adjustStock,
    lowStockCount,
    outOfStockCount
  } = useShop();

  const [activeSubTab, setActiveSubTab] = useState('inventory'); // 'inventory' | 'audit-logs'
  const [filterStockStatus, setFilterStockStatus] = useState('all'); // 'all' | 'low' | 'out' | 'healthy'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForRestock, setSelectedProductForRestock] = useState(null);
  const [quickAdjustLoadingId, setQuickAdjustLoadingId] = useState(null);

  const filteredInventory = products.filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        p.name.toLowerCase().includes(q) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filterStockStatus === 'low') {
      return p.stock > 0 && p.stock <= p.lowStockThreshold;
    }
    if (filterStockStatus === 'out') {
      return p.stock === 0;
    }
    if (filterStockStatus === 'healthy') {
      return p.stock > p.lowStockThreshold;
    }

    return true;
  });

  const handleQuickAdjust = async (productId, delta) => {
    setQuickAdjustLoadingId(productId);
    try {
      const reason = delta > 0 ? "تزويد سريع بالمخزون (+)" : "تعديل سريع بالخصم (-)";
      await adjustStock(productId, delta, reason);
    } catch (err) {
      alert(err.message || "فشل تعديل المخزون");
    } finally {
      setQuickAdjustLoadingId(null);
    }
  };

  const healthyCount = products.filter(p => p.stock > p.lowStockThreshold).length;

  return (
    <div className="space-y-5 text-right" dir="rtl">
      {/* الرأس والتبديل بين الأرصدة وسجل التدقيق */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-600" />
            <span>تتبع المخزون والواردات اللحظي</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            مراقبة حدود التنبيه، تجنب نفاذ المنتجات، ومراجعة سجل تدقيق الحركات.
          </p>
        </div>

        {/* أزرار التبديل */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`px-4 py-2 rounded-lg transition cursor-pointer ${
              activeSubTab === 'inventory'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            أرصدة المخزون ({products.length})
          </button>
          <button
            onClick={() => setActiveSubTab('audit-logs')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'audit-logs'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>سجل الحركات ({inventoryLogs.length})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'inventory' ? (
        <>
          {/* فلاتر الفرز السريعة والبحث */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* شرائح التصفية */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterStockStatus('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  filterStockStatus === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                جميع المنتجات ({products.length})
              </button>

              <button
                onClick={() => setFilterStockStatus('low')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 cursor-pointer ${
                  filterStockStatus === 'low'
                    ? 'bg-amber-500 text-slate-950 border-amber-500'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>قارب على النفاد ({lowStockCount})</span>
              </button>

              <button
                onClick={() => setFilterStockStatus('out')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 cursor-pointer ${
                  filterStockStatus === 'out'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                }`}
              >
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>نفد من المخزون ({outOfStockCount})</span>
              </button>

              <button
                onClick={() => setFilterStockStatus('healthy')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 cursor-pointer ${
                  filterStockStatus === 'healthy'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>مخزون وافر ({healthyCount})</span>
              </button>
            </div>

            {/* مربع البحث */}
            <div className="relative w-full md:w-72">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث بالاسم أو كود SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 pl-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          {/* جدول وبطاقات رصيد المخزون */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* بطاقات مخصصة للهواتف الذكية */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredInventory.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-bold">
                  لا توجد منتجات تطابق الفلتر المختار.
                </div>
              ) : (
                filteredInventory.map(product => {
                  const isOutOfStock = product.stock <= 0;
                  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
                  return (
                    <div key={product.id} className="p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs truncate" title={product.name}>
                              {product.name}
                            </h4>
                            <span className="font-mono text-[10px] text-slate-400 block">{product.sku} • {product.category}</span>
                            <span className="text-[11px] font-black text-slate-900 mt-0.5 block">
                              {formatCurrency(product.salePrice || product.price)}
                            </span>
                          </div>
                        </div>

                        <div className="text-left shrink-0">
                          <span className={`inline-block font-mono font-black text-base ${
                            isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-emerald-700'
                          }`}>
                            {product.stock}
                          </span>
                          <span className="text-[10px] text-slate-400 block">قطع بالمخزون</span>
                        </div>
                      </div>

                      {/* شريط الإجراءات السريعة للموبايل */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100/80">
                        <div>
                          {isOutOfStock ? (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              نفد
                            </span>
                          ) : isLowStock ? (
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              منخفض ({product.stock})
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              كافٍ وسليم
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleQuickAdjust(product.id, -1)}
                            disabled={product.stock <= 0 || quickAdjustLoadingId === product.id}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center disabled:opacity-30 active:scale-95 cursor-pointer"
                            title="خصم 1"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(product.id, 1)}
                            disabled={quickAdjustLoadingId === product.id}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center active:scale-95 cursor-pointer"
                            title="إضافة 1"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(product.id, 5)}
                            disabled={quickAdjustLoadingId === product.id}
                            className="px-2.5 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center active:scale-95 cursor-pointer"
                            title="تزويد سريع بـ 5"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => setSelectedProductForRestock(product)}
                            className="px-3 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>تزويد</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* جدول الشاشات الكبيرة */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">المنتج والكود SKU</th>
                    <th className="py-3 px-4">القسم</th>
                    <th className="py-3 px-4">السعر وهامش الربح</th>
                    <th className="py-3 px-4">الرصيد الحالي</th>
                    <th className="py-3 px-4">حد التنبيه</th>
                    <th className="py-3 px-4">حالة الصحة</th>
                    <th className="py-3 px-4 text-left">تزويد سريع / إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-400">
                        لا توجد منتجات تطابق الفلتر المختار.
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map(product => {
                      const isOutOfStock = product.stock <= 0;
                      const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
                      const sellingPrice = product.salePrice !== null ? product.salePrice : product.price;
                      const cost = product.costPrice || sellingPrice * 0.5;
                      const margin = Math.round(((sellingPrice - cost) / sellingPrice) * 100);

                      return (
                        <tr key={product.id} className="hover:bg-slate-50/80 transition">
                          {/* اسم المنتج والكود */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-100 shrink-0"
                              />
                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-900 truncate max-w-xs" title={product.name}>
                                  {product.name}
                                </h4>
                                <span className="font-mono text-[11px] text-slate-400 block">{product.sku}</span>
                              </div>
                            </div>
                          </td>

                          {/* القسم */}
                          <td className="py-3 px-4 text-slate-600 font-bold">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              {product.category}
                            </span>
                          </td>

                          {/* السعر وهامش الربح */}
                          <td className="py-3 px-4">
                            <div className="font-black text-slate-900">{formatCurrency(sellingPrice)}</div>
                            <div className="text-[10px] text-slate-400">
                              التكلفة: {formatCurrency(cost)} (هامش {margin}%)
                            </div>
                          </td>

                          {/* الرصيد الحالي وشريط الصحة */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-black font-mono ${
                                isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-slate-900'
                              }`}>
                                {product.stock} قطعة
                              </span>
                            </div>
                            <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                              <div
                                className={`h-full ${
                                  isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{
                                  width: `${Math.min(100, (product.stock / (product.lowStockThreshold * 3 || 15)) * 100)}%`
                                }}
                              />
                            </div>
                          </td>

                          {/* حد التنبيه */}
                          <td className="py-3 px-4 text-slate-500 font-mono">
                            ≤ {product.lowStockThreshold} قطعة
                          </td>

                          {/* الشارة */}
                          <td className="py-3 px-4">
                            {isOutOfStock ? (
                              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                <XCircle className="w-3 h-3 text-rose-600" />
                                نفد من المخزون
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                قارب على النفاد
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                كافٍ وسليم
                              </span>
                            )}
                          </td>

                          {/* إجراءات التزويد السريع */}
                          <td className="py-3 px-4 text-left">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleQuickAdjust(product.id, -1)}
                                disabled={product.stock <= 0 || quickAdjustLoadingId === product.id}
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs disabled:opacity-30 transition cursor-pointer"
                                title="إنقاص المخزون بمقدار 1"
                              >
                                -1
                              </button>
                              <button
                                onClick={() => handleQuickAdjust(product.id, 1)}
                                disabled={quickAdjustLoadingId === product.id}
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs transition cursor-pointer"
                                title="زيادة المخزون بمقدار 1"
                              >
                                +1
                              </button>
                              <button
                                onClick={() => handleQuickAdjust(product.id, 5)}
                                disabled={quickAdjustLoadingId === product.id}
                                className="px-2 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition cursor-pointer"
                                title="تزويد سريع بـ 5 قطع"
                              >
                                +5
                              </button>

                              <button
                                onClick={() => setSelectedProductForRestock(product)}
                                className="px-2.5 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition flex items-center gap-1 shadow-sm cursor-pointer mr-1"
                              >
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>تزويد</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* سجل تدقيق حركات المخزون الكامل */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">سجل تدقيق حركة المخزون التاريخي</h3>
              <p className="text-xs text-slate-400">سجل غير قابل للتعديل يوثق كل عملية بيع أو تزويد أو تصحيح جرد.</p>
            </div>
            <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 font-bold">
              {inventoryLogs.length} حركة موثقة
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">التاريخ والوقت</th>
                  <th className="py-2.5 px-3">المنتج والكود</th>
                  <th className="py-2.5 px-3">نوع الحركة</th>
                  <th className="py-2.5 px-3 text-center">التغيير</th>
                  <th className="py-2.5 px-3">مسار الرصيد</th>
                  <th className="py-2.5 px-3">السبب / المرجع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventoryLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-400 font-mono whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-2.5 px-3">
                      <strong className="text-slate-800 block">{log.productName}</strong>
                      <span className="font-mono text-[10px] text-slate-400">{log.sku}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.type === 'بيع' || log.type === 'SALE'
                          ? 'bg-blue-100 text-blue-800'
                          : log.type === 'توريد' || log.type === 'RESTOCK'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`font-mono font-black px-2 py-0.5 rounded ${
                        log.change > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                      }`}>
                        {log.change > 0 ? `+${log.change}` : log.change}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {log.previousStock} قطعة ➔ <strong className="text-slate-900">{log.newStock} قطعة</strong>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {log.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* نافذة التزويد السريع */}
      {selectedProductForRestock && (
        <QuickRestockModal
          product={selectedProductForRestock}
          onClose={() => setSelectedProductForRestock(null)}
        />
      )}
    </div>
  );
}
