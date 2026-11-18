import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  playOrderNotificationSound,
  showOrderPushNotification,
  requestPushPermission
} from '../utils/notifications';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([
    "جميع الأقسام",
    "عطور وعود",
    "أزياء وعبايات",
    "إلكترونيات",
    "قهوة ومأكولات فاخرة",
    "ديكور ومنزل"
  ]);
  const [orders, setOrders] = useState([]);
  const [inventoryLogs, setInventoryLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('souq_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('جميع الأقسام');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'in' | 'low' | 'out'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'stock-asc' | 'stock-desc' | 'name'

  // Modals & Panels
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return !!sessionStorage.getItem('souq_admin_auth');
    } catch {
      return false;
    }
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [currentAdminTab, setCurrentAdminTab] = useState('dashboard'); // 'dashboard' | 'inventory' | 'products' | 'orders'
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  // Real-Time Mobile & Push Notifications State
  const [adminSettings, setAdminSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('souq_heba_admin_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          adminPhone: parsed.adminPhone || '01000000000',
          telegramBotToken: parsed.telegramBotToken || '',
          telegramChatId: parsed.telegramChatId || '',
          notifyOnNewOrder: parsed.notifyOnNewOrder !== false,
          enableSoundAlerts: parsed.enableSoundAlerts !== false
        };
      }
    } catch (e) {
      console.warn("Could not read admin settings from localStorage:", e);
    }
    return {
      adminPhone: '01000000000',
      telegramBotToken: '',
      telegramChatId: '',
      notifyOnNewOrder: true,
      enableSoundAlerts: true
    };
  });
  const [realtimeOrderAlert, setRealtimeOrderAlert] = useState(null);
  const [pushPermission, setPushPermission] = useState(() => {
    return typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported';
  });

  const knownOrderIdsRef = useRef(new Set());
  const initialLoadDoneRef = useRef(false);

  // Save cart changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('souq_cart', JSON.stringify(cart));
    } catch (e) {
      console.error("Cart save error:", e);
    }
  }, [cart]);

  // Fetch initial data from server
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('فشل جلب المنتجات');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.warn("API unavailable, fallback", err);
    }
  };

  const fetchOrders = async (isPolling = false) => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('فشل جلب الطلبات');
      const data = await res.json();
      const fetchedOrders = data.orders || [];
      setOrders(fetchedOrders);

      // Real-time detection of new incoming orders
      if (initialLoadDoneRef.current && isPolling) {
        const newlyArrived = fetchedOrders.filter(o => !knownOrderIdsRef.current.has(o.id));
        if (newlyArrived.length > 0) {
          const newest = newlyArrived[0];
          setRealtimeOrderAlert(newest);
          showOrderPushNotification(newest);
          newlyArrived.forEach(o => knownOrderIdsRef.current.add(o.id));
        }
      } else {
        fetchedOrders.forEach(o => knownOrderIdsRef.current.add(o.id));
        initialLoadDoneRef.current = true;
      }
    } catch (err) {
      console.warn("API orders error", err);
    }
  };

  const fetchAdminSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setAdminSettings(prev => {
            // Merge with local state to ensure Telegram Bot Token and Chat ID are NEVER lost
            const merged = {
              ...prev,
              ...data.settings,
              telegramBotToken: data.settings.telegramBotToken || prev.telegramBotToken || '',
              telegramChatId: data.settings.telegramChatId || prev.telegramChatId || ''
            };
            try {
              localStorage.setItem('souq_heba_admin_settings', JSON.stringify(merged));
            } catch (e) {}

            // If server lacked credentials but localStorage has them, auto-sync them to Firestore
            if ((!data.settings.telegramBotToken && merged.telegramBotToken) ||
                (!data.settings.telegramChatId && merged.telegramChatId)) {
              updateAdminSettings(merged).catch(() => {});
            }
            return merged;
          });
        }
      }
    } catch (err) {
      console.warn("Admin settings fetch error:", err);
    }
  };

  const updateAdminSettings = async (updates) => {
    try {
      // Save immediately to localStorage so configs are never lost even across sessions
      setAdminSettings(prev => {
        const merged = { ...prev, ...updates };
        try {
          localStorage.setItem('souq_heba_admin_settings', JSON.stringify(merged));
        } catch (e) {}
        return merged;
      });

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.settings) {
        setAdminSettings(prev => {
          const merged = {
            ...prev,
            ...data.settings,
            telegramBotToken: data.settings.telegramBotToken || prev.telegramBotToken || '',
            telegramChatId: data.settings.telegramChatId || prev.telegramChatId || ''
          };
          try {
            localStorage.setItem('souq_heba_admin_settings', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
      }
      return data;
    } catch (err) {
      throw err;
    }
  };

  const testAdminNotification = async (customConfig) => {
    try {
      const res = await fetch('/api/admin/test-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customConfig || adminSettings)
      });
      return await res.json();
    } catch (err) {
      throw err;
    }
  };

  const enablePushNotifications = async () => {
    const res = await requestPushPermission();
    setPushPermission(res);
    if (res === 'granted') {
      playOrderNotificationSound();
    }
    return res;
  };

  const dismissRealtimeOrderAlert = () => {
    setRealtimeOrderAlert(null);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('فشل جلب الإحصائيات');
      const data = await res.json();
      setStats(data.stats || null);
    } catch (err) {
      console.warn("API stats error", err);
    }
  };

  const fetchInventoryLogs = async () => {
    try {
      const res = await fetch('/api/inventory/logs');
      if (!res.ok) throw new Error('فشل جلب سجل المخزون');
      const data = await res.json();
      setInventoryLogs(data.logs || []);
    } catch (err) {
      console.warn("API inventory logs error", err);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.allSettled([
      fetchProducts(),
      fetchOrders(),
      fetchStats(),
      fetchInventoryLogs()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
    fetchAdminSettings();

    // Real-time polling every 4 seconds to listen for incoming orders from anywhere
    const pollInterval = setInterval(() => {
      fetchOrders(true);
      fetchStats();
    }, 4000);

    return () => clearInterval(pollInterval);
  }, []);

  // --- CART OPERATIONS ---
  const addToCart = (product, quantity = 1) => {
    if (product.stock <= 0) {
      alert(`عذراً، المنتج "${product.name}" نفد من المخزون حالياً.`);
      return false;
    }

    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          alert(`لا يمكن إضافة المزيد. أقصى كمية متوفرة في المخزون للمنتج "${product.name}" هي ${product.stock} قطع.`);
          return prevCart.map(item =>
            item.id === product.id ? { ...item, quantity: product.stock } : item
          );
        }
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        const addedQty = Math.min(quantity, product.stock);
        return [...prevCart, { ...product, quantity: addedQty }];
      }
    });

    return true;
  };

  const updateCartQuantity = (productId, quantity) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (quantity > product.stock) {
      alert(`عذراً، متوفر فقط ${product.stock} قطع في المخزون.`);
      quantity = product.stock;
    }

    setCart(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- ORDER PLACEMENT (CHECKOUT) ---
  const placeOrder = async (orderPayload) => {
    try {
      const payloadWithSettings = {
        ...orderPayload,
        adminTelegramToken: adminSettings?.telegramBotToken || '',
        adminTelegramChatId: adminSettings?.telegramChatId || ''
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadWithSettings)
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'فشل إتمام الطلب');
      }

      clearCart();
      await refreshAll();
      return data.order;
    } catch (err) {
      throw err;
    }
  };

  // --- ADMIN ACTIONS: PRODUCT MANAGEMENT ---
  const addProduct = async (productData) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'فشل إضافة المنتج');
      await refreshAll();
      return data.product;
    } catch (err) {
      throw err;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'فشل تحديث المنتج');
      await refreshAll();
      return data.product;
    } catch (err) {
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'فشل حذف المنتج');
      await refreshAll();
      return true;
    } catch (err) {
      throw err;
    }
  };

  // --- ADMIN ACTIONS: STOCK ADJUSTMENT & TRACKING ---
  const adjustStock = async (productId, change, reason = "توريد يدوي", note = "") => {
    try {
      const res = await fetch(`/api/products/${productId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ change, reason, note })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'فشل تحديث المخزون');
      await refreshAll();
      return data;
    } catch (err) {
      throw err;
    }
  };

  // --- ADMIN ACTIONS: ORDERS ---
  const updateOrderStatus = async (orderId, status, restock = false) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, restock })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'فشل تحديث حالة الطلب');
      await refreshAll();
      return data.order;
    } catch (err) {
      throw err;
    }
  };

  const resetDemoData = async () => {
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error('فشلت إعادة تعيين البيانات');
      await refreshAll();
      return true;
    } catch (err) {
      throw err;
    }
  };

  // --- ADMIN AUTHENTICATION ---
  const adminLogin = async (password) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'كلمة المرور غير صحيحة');
      }

      sessionStorage.setItem('souq_admin_auth', data.token);
      setIsAdminAuthenticated(true);
      setIsAdminLoginModalOpen(false);
      setIsAdminOpen(true);
      return true;
    } catch (err) {
      throw err;
    }
  };

  const adminLogout = () => {
    try {
      sessionStorage.removeItem('souq_admin_auth');
    } catch {}
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
  };

  const openAdminPortal = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  // Derived filtered & sorted products
  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'جميع الأقسام' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        p.name.toLowerCase().includes(q) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (stockFilter === 'in' && p.stock <= p.lowStockThreshold) return false;
    if (stockFilter === 'low' && (p.stock === 0 || p.stock > p.lowStockThreshold)) return false;
    if (stockFilter === 'out' && p.stock > 0) return false;

    return true;
  }).sort((a, b) => {
    const priceA = a.salePrice !== null ? a.salePrice : a.price;
    const priceB = b.salePrice !== null ? b.salePrice : b.price;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'stock-asc') return a.stock - b.stock;
    if (sortBy === 'stock-desc') return b.stock - a.stock;
    if (sortBy === 'name') return a.name.localeCompare(b.name, 'ar');
    return 0;
  });

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.salePrice !== null ? item.salePrice : item.price;
    return acc + price * item.quantity;
  }, 0);

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <ShopContext.Provider
      value={{
        products,
        filteredProducts,
        categories,
        orders,
        inventoryLogs,
        stats,
        cart,
        cartTotalItems,
        cartSubtotal,
        lowStockCount,
        outOfStockCount,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        stockFilter,
        setStockFilter,
        sortBy,
        setSortBy,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        adminLogin,
        adminLogout,
        openAdminPortal,
        currentAdminTab,
        setCurrentAdminTab,
        selectedProductForModal,
        setSelectedProductForModal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        placeOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        updateOrderStatus,
        resetDemoData,
        refreshAll,
        adminSettings,
        updateAdminSettings,
        testAdminNotification,
        realtimeOrderAlert,
        dismissRealtimeOrderAlert,
        pushPermission,
        enablePushNotifications
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
