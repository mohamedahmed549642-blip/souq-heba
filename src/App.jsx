import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Storefront from './components/Storefront';
import AdminPortal from './components/admin/AdminPortal';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminLoginModal from './components/AdminLoginModal';
import RealtimeOrderToast from './components/RealtimeOrderToast';
import MobileBottomNav from './components/MobileBottomNav';

function ShopContent() {
  const { isAdminRoute } = useShop();

  // Dedicated Secret Admin Route (/admin)
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-emerald-500 selection:text-white" dir="rtl">
        <AdminPortal />
        <RealtimeOrderToast />
      </div>
    );
  }

  // 100% Dedicated Clean Customer Storefront (/)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white" dir="rtl">
      <Navbar />

      <main className="flex-1 pb-20 md:pb-0">
        <Storefront />
      </main>

      <Footer />

      {/* Modern App-Style Mobile Bottom Navigation Bar for Customers */}
      <MobileBottomNav />

      {/* Global Customer Modals & Realtime Alerts */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <RealtimeOrderToast />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <ShopContent />
    </ShopProvider>
  );
}
