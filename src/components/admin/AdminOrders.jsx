import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Phone,
  MapPin,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatCurrency } from '../../utils/format';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useShop();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all') {
      const s = order.status.toLowerCase();
      const f = statusFilter.toLowerCase();
      if (!s.includes(f) && !f.includes(s)) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        order.id.toLowerCase().includes(q) ||
        order.trackingNumber.toLowerCase().includes(q) ||
        order.customer.name.toLowerCase().includes(q) ||
        order.customer.phone.includes(q) ||
        order.customer.address.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    let restock = false;
    if (newStatus.includes('ملغي')) {
      restock = confirm("هل ترغب في إعادة حجز منتجات هذا الطلب تلقائياً إلى رصيد المخزون المتوفر؟");
    }

    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus, restock);
    } catch (err) {
      alert(err.message || "فشل تحديث حالة الطلب");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'تم التسليم' || status === 'Delivered') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    if (status === 'خرج للتوصيل' || status === 'تم الشحن' || status === 'Shipped') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (status === 'قيد التجهيز' || status === 'Processing') {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    if (status.includes('ملغي') || status === 'Cancelled') {
      return 'bg-rose-100 text-rose-800 border-rose-200';
    }
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  return (
    <div className="space-y-5 text-right" dir="rtl">
      {/* الرأس العلوي */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <span>طلبات العملاء والتجهيز والشحن</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            معالجة طلبات الشراء، تتبع الشحن، وتحديث حالة التسليم للزبائن.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span className="bg-slate-100 px-3 py-1.5 rounded-xl font-mono">
            {orders.length} إجمالي الطلبات المستلمة
          </span>
        </div>
      </div>

      {/* الفلاتر والبحث */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* شرائح الحالات */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: `الكل (${orders.length})` },
            { id: 'قيد الانتظار', label: 'قيد الانتظار' },
            { id: 'قيد التجهيز', label: 'قيد التجهيز' },
            { id: 'خرج للتوصيل', label: 'خرج للتوصيل' },
            { id: 'تم التسليم', label: 'تم التسليم' },
            { id: 'ملغي', label: 'الملغية' }
          ].map(stg => (
            <button
              key={stg.id}
              onClick={() => setStatusFilter(stg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                statusFilter === stg.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {stg.label}
            </button>
          ))}
        </div>

        {/* البحث */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث برقم الطلب، اسم العميل، الجوال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>
      </div>

      {/* قائمة الطلبات */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs font-bold">
            لا توجد طلبات شراء تطابق المعايير المحددة.
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4 hover:border-slate-300 transition"
            >
              {/* شريط رأس الطلب */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-mono font-black text-xs text-slate-800">
                    {order.id.replace('ORD-', '#')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{order.customer.name}</h4>
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        كود: {order.trackingNumber}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      تاريخ الطلب: {new Date(order.createdAt).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>

                {/* منتقي تحديث الحالة */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">حالة الطلب:</span>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition focus:outline-none cursor-pointer ${getStatusBadge(order.status)}`}
                  >
                    <option value="قيد الانتظار">قيد الانتظار</option>
                    <option value="قيد التجهيز">قيد التجهيز</option>
                    <option value="خرج للتوصيل">خرج للتوصيل / قيد الشحن</option>
                    <option value="تم التسليم">تم التسليم بنجاح</option>
                    <option value="ملغي (إعادة للمخزون)">ملغي (مع إعادة للمخزون)</option>
                  </select>
                </div>
              </div>

              {/* شبكة معلومات العميل والتوصيل */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-xl">
                <div>
                  <span className="text-slate-400 block font-bold">بيانات التواصل</span>
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-mono">{order.customer.phone}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate">{order.customer.email}</span>
                </div>

                <div>
                  <span className="text-slate-400 block font-bold">عنوان وجهة التوصيل</span>
                  <div className="flex items-start gap-1.5 text-slate-800 font-medium mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{order.customer.address}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block font-bold">الدفع والإجمالي</span>
                  <strong className="text-sm font-black text-slate-900 block mt-0.5">
                    {formatCurrency(order.total)}
                  </strong>
                  <span className="text-[11px] text-slate-500 font-bold">{order.paymentMethod}</span>
                </div>
              </div>

              {/* المنتجات في هذا الطلب */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  المنتجات المحجوزة ({order.items.reduce((acc, i) => acc + i.quantity, 0)} قطع إجمالي)
                </span>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {order.items.map(item => (
                    <div key={item.id} className="p-2.5 flex items-center justify-between text-xs bg-white">
                      <div className="flex items-center gap-2.5">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0" />
                        )}
                        <div>
                          <strong className="text-slate-800">{item.name}</strong>
                          <span className="text-slate-400 text-[11px] block">
                            كود: {item.sku || 'N/A'} • {formatCurrency(item.price)} للقطعة
                          </span>
                        </div>
                      </div>
                      <div className="text-left font-mono">
                        <span className="font-black text-slate-900">
                          {item.quantity} × {formatCurrency(item.price)} = {formatCurrency(item.quantity * item.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
