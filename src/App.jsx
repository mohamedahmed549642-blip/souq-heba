import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Storefront from './components/Storefront';
import AdminPortal from './components/admin/AdminPortal';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import AdminLoginModal from './components/AdminLoginModal';
import RealtimeOrderToast from './components/RealtimeOrderToast';
import MobileBottomNav from './components/MobileBottomNav';

function ShopContent() {
  const { isAdminOpen } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pb-20 md:pb-0">
        {isAdminOpen ? (
          <AdminPortal />
        ) : (
          <Storefront />
        )}
      </main>

      {!isAdminOpen && <Footer />}

      {/* Modern App-Style Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Global Interactive Modals */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <AdminLoginModal />
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
