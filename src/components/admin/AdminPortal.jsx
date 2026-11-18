import React, { useState } from 'react';
import {
  LayoutDashboard,
  Boxes,
  Package,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Plus,
  RefreshCw,
  LogOut,
  Lock,
  Bell
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import AdminDashboard from './AdminDashboard';
import AdminInventory from './AdminInventory';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminNotificationSettings from './AdminNotificationSettings';

export default function AdminPortal() {
  const {
    currentAdminTab,
    setCurrentAdminTab,
    setIsAdminOpen,
    isAdminAuthenticated,
    adminLogout,
    setIsAdminLoginModalOpen,
    lowStockCount,
    outOfStockCount,
    orders,
    refreshAll,
    loading
  } = useShop();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // If not authenticated, show secure lock screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 text-center" dir="rtl">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">منطقة محمية بكلمة مرور</h2>
          <p className="text-xs text-slate-500 mb-6">
            لوحة الإدارة وتتبع المخزون مخصصة لمدير المتجر فقط. يرجى تسجيل الدخول بكلمة المرور للمتابعة.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAdminLoginModalOpen(true)}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              تسجيل الدخول بكلمة المرور
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              العودة للمتجر
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pendingOrdersCount = orders.filter(o => o.status === 'قيد الانتظار' || o.status === 'قيد التجهيز').length;
  const stockAlertsCount = lowStockCount + outOfStockCount;

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16 animate-in fade-in duration-200 text-right" dir="rtl">
      {/* شريط الإدارة العلوي */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="العودة إلى متجر الزبائن"
            >
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <span>واجهة المتجر</span>
            </button>
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black tracking-tight">
                  سوق هبة • لوحة الإدارة وتتبع المخزون
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">مراقبة المخزون، كتالوج المنتجات ومعالجة الطلبات</p>
              </div>
            </div>
          </div>

          {/* زر التحديث وإضافة منتج وزر الخروج */}
          <div className="flex items-center gap-2">
            <button
              onClick={refreshAll}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1 cursor-pointer font-bold"
              title="تحديث البيانات من السيرفر"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden md:inline">مزامنة</span>
            </button>

            <button
              onClick={() => {
                setCurrentAdminTab('products');
                setIsAddModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
            </button>

            <button
              onClick={adminLogout}
              className="px-3 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/60 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="تسجيل الخروج وقفل لوحة الإدارة"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        {/* أشرطة التبويب مع تمرير أفقي سلس على الموبايل */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex overflow-x-auto gap-1.5 sm:gap-2 border-t border-slate-800/80 pt-1.5 pb-1.5 scrollbar-none touch-pan-x">
          <button
            onClick={() => setCurrentAdminTab('dashboard')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              currentAdminTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>المؤشرات</span>
          </button>

          <button
            onClick={() => setCurrentAdminTab('inventory')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              currentAdminTab === 'inventory'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>المخزون والواردات</span>
            {stockAlertsCount > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                {stockAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentAdminTab('products')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              currentAdminTab === 'products'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>المنتجات</span>
          </button>

          <button
            onClick={() => setCurrentAdminTab('orders')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              currentAdminTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>الطلبات</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentAdminTab('notifications')}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              currentAdminTab === 'notifications'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>إشعارات الموبايل</span>
          </button>
        </div>
      </div>

      {/* الحاوية الرئيسية للوحة الإدارة */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {currentAdminTab === 'dashboard' && (
          <AdminDashboard
            onTabChange={setCurrentAdminTab}
            onOpenAddProduct={() => {
              setCurrentAdminTab('products');
              setIsAddModalOpen(true);
            }}
          />
        )}

        {currentAdminTab === 'inventory' && (
          <AdminInventory />
        )}

        {currentAdminTab === 'products' && (
          <AdminProducts
            isAddModalOpen={isAddModalOpen}
            setIsAddModalOpen={setIsAddModalOpen}
          />
        )}

        {currentAdminTab === 'orders' && (
          <AdminOrders />
        )}

        {currentAdminTab === 'notifications' && (
          <AdminNotificationSettings />
        )}
      </main>
    </div>
  );
}
