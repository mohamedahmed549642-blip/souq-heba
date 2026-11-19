import React, { useState, useEffect } from 'react';
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
  Bell,
  Eye,
  EyeOff,
  KeyRound,
  Store,
  Smartphone,
  Download,
  X,
  Share2
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
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    navigate,
    lowStockCount,
    outOfStockCount,
    orders,
    refreshAll,
    loading
  } = useShop();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Progressive Web App (PWA) Install Prompt States
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detect if already installed / running in standalone window
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginPassword.trim()) {
      setErrorMessage('يرجى كتابة كلمة المرور');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminLogin(loginPassword);
      setLoginPassword('');
    } catch (err) {
      setErrorMessage(err.message || 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not authenticated, show dedicated full-screen Admin Login Page
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col justify-center items-center p-4 text-right" dir="rtl">
        <div className="max-w-md w-full bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl text-slate-900">
          {/* رأس الصفحة */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-600/30">
              <Lock className="w-8 h-8 text-amber-300" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>بوابة الإدارة المركزية • سوق هبة</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              تسجيل دخول المشرف
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              منطقة إدارية مخصصة ومحمية لمتابعة المخزون، معالجة الطلبات وإعدادات التنبيهات.
            </p>
          </div>

          {/* نموذج تسجيل الدخول */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold animate-in shake duration-200">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                كلمة مرور لوحة التحكم:
              </label>
              <div className="relative">
                <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="أدخل كلمة المرور..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pr-10 pl-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono text-left"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'جاري التحقق...' : 'تسجيل الدخول إلى لوحة الإدارة 🚀'}
            </button>

            {/* تلميح كلمة المرور الافتراضية */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-center justify-between">
              <span>كلمة المرور الافتراضية:</span>
              <code className="bg-amber-200/80 px-2 py-0.5 rounded font-mono font-bold text-slate-900">
                admin123
              </code>
            </div>

            {/* زر تثبيت تطبيق الإدارة المباشر */}
            {!isInstalled && (
              <button
                type="button"
                onClick={handleInstallPWA}
                className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm border border-slate-700 active:scale-95"
              >
                <Smartphone className="w-4 h-4 text-orange-400" />
                <span>تثبيت تطبيق الإدارة على هاتفك 📲</span>
              </button>
            )}

            {/* العودة إلى المتجر */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>العودة إلى واجهة متجر الزبائن (/)</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingOrdersCount = orders.filter(o => o.status === 'قيد الانتظار' || o.status === 'قيد التجهيز').length;
  const stockAlertsCount = lowStockCount + outOfStockCount;

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20 md:pb-16 animate-in fade-in duration-200 text-right" dir="rtl">
      {/* شريط الإدارة العلوي */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="العودة إلى متجر الزبائن"
            >
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <span>عرض المتجر للعملاء</span>
            </button>
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white shadow-sm ring-2 ring-orange-500/40 shrink-0">
                <img src="/logo.png" alt="سوق هبة" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>سوق هبة</span>
                  <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-black">ADMIN</span>
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">لوحة الإدارة المركزية • المخزون، الطلبات وإشعارات الموبايل</p>
              </div>
            </div>
          </div>

          {/* أزرار الإجراءات العلوية */}
          <div className="flex items-center gap-2">
            {!isInstalled && (
              <button
                type="button"
                onClick={handleInstallPWA}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition cursor-pointer active:scale-95 shrink-0"
                title="تثبيت لوحة الإدارة كتطبيق مستقل على هاتفك"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تثبيت تطبيق الإدارة 📲</span>
                <span className="sm:hidden">تثبيت 📲</span>
              </button>
            )}

            <button
              onClick={refreshAll}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1 cursor-pointer font-bold"
              title="تحديث ومزامنة البيانات من السحابة"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden md:inline">مزامنة سحابية</span>
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
              <span>خروج</span>
            </button>
          </div>
        </div>

        {/* أشرطة التبويب لسطح المكتب والموبايل */}
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
            <span>المؤشرات العامة</span>
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
            <span>كتالوج المنتجات</span>
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
            <span>إدارة الطلبات</span>
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
            <span>تنبيهات الموبايل وتيليجرام</span>
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

      {/* شريط تنقل سفلي خاص بالإدارة على الهواتف فقط */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))]"
        dir="rtl"
        aria-label="شريط تحكم المشرف للهاتف"
      >
        <div className="grid grid-cols-5 items-center text-center">
          <button
            onClick={() => setCurrentAdminTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              currentAdminTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">المؤشرات</span>
          </button>

          <button
            onClick={() => setCurrentAdminTab('inventory')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              currentAdminTab === 'inventory' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Boxes className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">المخزون</span>
          </button>

          <button
            onClick={() => setCurrentAdminTab('products')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              currentAdminTab === 'products' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Package className="w-4 h-4 mb-0.5" />
            <span className="text-[9px]">المنتجات</span>
          </button>

          <button
            onClick={() => setCurrentAdminTab('orders')}
            className={`relative flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              currentAdminTab === 'orders' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <ShoppingBag className="w-4 h-4 mb-0.5" />
            {pendingOrdersCount > 0 && (
              <span className="absolute top-0 right-3 bg-blue-500 text-white text-[8px] px-1 rounded-full font-bold">
                {pendingOrdersCount}
              </span>
            )}
            <span className="text-[9px]">الطلبات</span>
          </button>

          <button
            onClick={() => setCurrentAdminTab('notifications')}
            className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
              currentAdminTab === 'notifications' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Bell className="w-4 h-4 mb-0.5 text-amber-300" />
            <span className="text-[9px]">الإشعارات</span>
          </button>
        </div>
      </nav>

      {/* نافذة إرشادية لتثبيت التطبيق على الهواتف والحواسيب */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 text-right" dir="rtl">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">تثبيت تطبيق إدارة سوق هبة</h3>
                  <span className="text-[10px] text-slate-400">تطبيق مستقل لشاشة هاتفك الرئيسية</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-300">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="font-black text-emerald-400 block mb-1">🤖 أجهزة أندرويد والكمبيوتر:</span>
                <p className="leading-relaxed">
                  اضغط على زر خيارات المتصفح (الثلاث نقاط <strong className="font-mono text-white">⋮</strong> بأعلى المتصفح)، ثم اختر <strong>"تثبيت التطبيق"</strong> (Install App) أو إضافة إلى الشاشة الرئيسية.
                </p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="font-black text-sky-400 block mb-1">🍏 أجهزة آيفون iPhone (متصفح Safari):</span>
                <p className="leading-relaxed">
                  1. اضغط على أيقونة المشاركة (Share <Share2 className="w-3.5 h-3.5 inline mx-0.5 text-sky-400" />) أسفل الشاشة.
                  <br />
                  2. مرر للأسفل واختر <strong>"إضافة إلى الصفحة الرئيسية"</strong> (Add to Home Screen ➕).
                </p>
                <p className="text-[11px] text-amber-300 font-bold mt-1.5">
                  ✓ سيفتح التطبيق فورياً على شاشة كاملة بدون شريط المتصفح، مع إشعارات واهتزاز فور ورود أي طلب!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInstallModal(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition cursor-pointer"
            >
              فهمت، شكراً
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
