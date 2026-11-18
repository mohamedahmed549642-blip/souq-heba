import React from 'react';
import {
  DollarSign,
  Package,
  AlertTriangle,
  XCircle,
  TrendingUp,
  ShoppingBag,
  ArrowLeft,
  ShieldAlert,
  Clock,
  Plus,
  RotateCcw,
  Boxes,
  Bell,
  Smartphone
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatCurrency } from '../../utils/format';

export default function AdminDashboard({ onTabChange, onOpenAddProduct }) {
  const {
    products,
    orders,
    inventoryLogs,
    stats,
    lowStockCount,
    outOfStockCount,
    resetDemoData
  } = useShop();

  const totalProducts = products.length;
  const inStockCount = products.filter(p => p.stock > p.lowStockThreshold).length;

  const totalRevenue = stats ? stats.totalRevenue : orders.reduce((sum, o) => !o.status.includes('ملغي') ? sum + o.total : sum, 0);
  const totalAssetValue = stats ? stats.totalInventoryAssetValue : products.reduce((sum, p) => sum + (p.stock * (p.costPrice || p.price * 0.5)), 0);
  const totalRetailValue = stats ? stats.totalRetailPotentialValue : products.reduce((sum, p) => sum + (p.stock * (p.salePrice || p.price)), 0);

  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const outOfStockItems = products.filter(p => p.stock === 0);

  const handleResetData = async () => {
    if (confirm("هل أنت متأكد من إعادة تعيين المتجر إلى البيانات التجريبية الافتراضية؟ سيتم مسح أي تعديلات تجريبية.")) {
      await resetDemoData();
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* شريط التنبيه الفوري لنقص أو نفاد المخزون */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-300 rounded-3xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                  <span>تنبيه هام: يتطلب المخزون تدخلاً فورياً!</span>
                  {outOfStockCount > 0 && (
                    <span className="bg-rose-600 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                      {outOfStockCount} نفد بالكامل
                    </span>
                  )}
                  {lowStockCount > 0 && (
                    <span className="bg-amber-600 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                      {lowStockCount} قارب على النفاد
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  هناك منتجات استهلكت رصيدها أو أوشكت على النفاد. بادر بالتزويد لتفادي خسارة المبيعات.
                </p>
              </div>
            </div>

            <button
              onClick={() => onTabChange('inventory')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 self-stretch sm:self-auto justify-center cursor-pointer"
            >
              <span>إدارة وتزويد المخزون الآن</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* شرائح المنتجات المتأثرة */}
          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-amber-200/60">
            {outOfStockItems.map(p => (
              <span key={p.id} className="text-[11px] bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                <XCircle className="w-3 h-3 text-rose-600" />
                {p.name} (رصيد: 0)
              </span>
            ))}
            {lowStockItems.map(p => (
              <span key={p.id} className="text-[11px] bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                {p.name} (متبقي {p.stock} / الحد {p.lowStockThreshold})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* بطاقات مؤشرات الأداء الرئيسية */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* إجمالي المبيعات */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">إجمالي المبيعات</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              ج.م
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {formatCurrency(totalRevenue)}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> من واقع {orders.length} طلب عملاء
          </span>
        </div>

        {/* إجمالي طلبات العملاء */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">إجمالي الطلبات</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {orders.length}
          </div>
          <span className="text-[11px] text-slate-500 font-bold">
            {orders.filter(o => o.status === 'قيد الانتظار' || o.status === 'قيد التجهيز').length} طلب قيد التجهيز والشحن
          </span>
        </div>

        {/* قيمة أصول المخزون المستودعي */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">قيمة أصول المخزون</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {formatCurrency(totalAssetValue)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            القيمة السوقية للبيع: {formatCurrency(totalRetailValue)}
          </span>
        </div>

        {/* صحة المخزون */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">سلامة المخزون</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-black text-slate-900">{inStockCount}</span>
            <span className="text-xs text-slate-400 font-bold">/ {totalProducts} منتج صحي</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${(inStockCount / (totalProducts || 1)) * 100}%` }}
              title="مخزون وافر وسليم"
            />
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${(lowStockCount / (totalProducts || 1)) * 100}%` }}
              title="مخزون منخفض"
            />
            <div
              className="bg-rose-500 h-full"
              style={{ width: `${(outOfStockCount / (totalProducts || 1)) * 100}%` }}
              title="نفد من المخزون"
            />
          </div>
        </div>
      </div>

      {/* شريط الإجراءات السريعة */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddProduct}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة / طرح منتج جديد</span>
          </button>
          <button
            onClick={() => onTabChange('inventory')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Boxes className="w-4 h-4 text-emerald-600" />
            <span>تتبع المخزون والواردات</span>
          </button>
          <button
            onClick={() => onTabChange('orders')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-blue-600" />
            <span>إدارة الطلبات والتجهيز</span>
          </button>
        </div>

        <button
          onClick={handleResetData}
          className="text-xs text-slate-400 hover:text-slate-600 transition flex items-center gap-1 cursor-pointer font-bold"
          title="إعادة تعيين المتجر إلى بيانات العرض الافتراضية"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة تعيين البيانات الافتراضية</span>
        </button>
      </div>

      {/* بطاقة التنبيهات الفورية على الموبايل */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm sm:text-base">تنبيهات الموبايل اللحظية للطلبات الجديدة</h3>
              <span className="bg-emerald-300 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Bell className="w-2.5 h-2.5" /> تنبيه فوري
              </span>
            </div>
            <p className="text-xs text-white/90 mt-1 max-w-xl">
              تصلك رنة صوتية واهتزاز وإشعار مباشر على هاتفك بمجرد إتمام أي عميل لطلبه داخل محافظات مصر، بالإضافة إلى إشعارات بوت تليجرام الفورية.
            </p>
          </div>
        </div>

        <button
          onClick={() => onTabChange('notifications')}
          className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-black rounded-xl shadow-sm transition flex items-center gap-2 shrink-0 cursor-pointer self-stretch md:self-auto justify-center"
        >
          <Bell className="w-4 h-4 text-emerald-600" />
          <span>إعدادات وتجربة إشعار الموبايل</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* شبكة عمودين: سجل حركة المخزون + أحدث الطلبات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* سجل حركة المخزون اللحظي */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">أحدث حركات المخزون (سجل التدقيق)</h3>
            </div>
            <button
              onClick={() => onTabChange('inventory')}
              className="text-xs text-emerald-700 hover:underline font-bold"
            >
              عرض السجل الكامل
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {inventoryLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">لا توجد حركات مخزون مسجلة بعد.</p>
            ) : (
              inventoryLogs.slice(0, 5).map(log => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-black px-1.5 py-0.5 rounded ${
                        log.change > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.change > 0 ? `+${log.change}` : log.change}
                      </span>
                      <strong className="text-slate-800">{log.productName}</strong>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">{log.reason}</span>
                  </div>
                  <div className="text-left text-[11px] text-slate-400">
                    <span className="font-bold text-slate-700">{log.newStock} رصيد القطع</span>
                    <span className="block">{new Date(log.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* أحدث طلبات العملاء */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">أحدث طلبات الشراء المستلمة</h3>
            </div>
            <button
              onClick={() => onTabChange('orders')}
              className="text-xs text-blue-700 hover:underline font-bold"
            >
              عرض كافة الطلبات
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">لم يتم استلام طلبات شراء بعد.</p>
            ) : (
              orders.slice(0, 5).map(order => (
                <div key={order.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="font-mono text-slate-900">{order.id}</strong>
                      <span className="text-slate-600">• {order.customer.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {order.items.length} أصناف • {formatCurrency(order.total)} ({order.paymentMethod})
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    order.status === 'تم التسليم' || order.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.status.includes('ملغي')
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
