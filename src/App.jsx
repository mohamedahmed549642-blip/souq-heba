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
import FloatingCartBar from './components/FloatingCartBar';
import FloatingWhatsApp from './components/FloatingWhatsApp';

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

      <main className="flex-1 pb-12">
        <Storefront />
      </main>

      <Footer />

      {/* Dynamic Floating Smart Cart Bar (appears when items added) & Floating WhatsApp Concierge */}
      <FloatingCartBar />
      <FloatingWhatsApp />

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
