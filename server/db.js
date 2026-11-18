import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_PRODUCTS } from './data/defaultProducts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getInitialData() {
  return {
    products: [...DEFAULT_PRODUCTS],
    orders: [
      {
        id: "ORD-9401",
        trackingNumber: "SH-2026-9401",
        customer: {
          name: "مريم عبد الرحمن",
          email: "mariam.a@example.com",
          phone: "01098765432",
          address: "شارع مصطفى النحاس، مدينة نصر، محافظة القاهرة، مصر"
        },
        items: [
          {
            id: "prod-1",
            sku: "OUD-ROYAL-01",
            name: "عطر عود الماجد الملكي الفاخر",
            price: 1250.00,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
          },
          {
            id: "prod-7",
            sku: "COF-ARABIC-07",
            name: "قهوة عربية شقراء أصيلة بالهيل والزعفران",
            price: 380.00,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
          }
        ],
        subtotal: 2010.00,
        discount: 201.00,
        shipping: 0.00,
        total: 1809.00,
        paymentMethod: "الدفع عند الاستلام نقداً (كاش)",
        status: "قيد التجهيز",
        notes: "يرجى الاتصال قبل الوصول للتأكد من وجود العميل في المنزل.",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: "ORD-9402",
        trackingNumber: "SH-2026-9402",
        customer: {
          name: "أحمد محمود الشريف",
          email: "ahmed.s@example.com",
          phone: "01234567890",
          address: "شارع جمال عبد الناصر، ميامي، محافظة الإسكندرية، مصر"
        },
        items: [
          {
            id: "prod-6",
            sku: "WATCH-OLED-06",
            name: "ساعة إيليت تيتانيوم الذكية بشاشة أموليد",
            price: 2850.00,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
          }
        ],
        subtotal: 2850.00,
        discount: 0.00,
        shipping: 0.00,
        total: 2850.00,
        paymentMethod: "الدفع عند الاستلام نقداً (كاش)",
        status: "تم التسليم",
        notes: "التسليم في مقر العمل بالدور الثالث.",
        createdAt: new Date(Date.now() - 3600000 * 28).toISOString()
      }
    ],
    inventoryLogs: [
      {
        id: "log-1",
        productId: "prod-1",
        productName: "عطر عود الماجد الملكي الفاخر",
        sku: "OUD-ROYAL-01",
        type: "توريد",
        change: 20,
        previousStock: 0,
        newStock: 20,
        reason: "إدخال المخزون التأسيسي للمتجر",
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: "log-2",
        productId: "prod-1",
        productName: "عطر عود الماجد الملكي الفاخر",
        sku: "OUD-ROYAL-01",
        type: "بيع",
        change: -1,
        previousStock: 20,
        newStock: 19,
        reason: "طلب عميل رقم #ORD-9401 (مريم عبد الرحمن)",
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: "log-3",
        productId: "prod-4",
        productName: "شال باشمينا كشميري أصلي فائق النعومة",
        sku: "SHAWL-CASH-04",
        type: "نفاذ",
        change: -4,
        previousStock: 4,
        newStock: 0,
        reason: "نفاد الكمية بالكامل في عروض التخفيضات",
        timestamp: new Date(Date.now() - 3600000 * 20).toISOString()
      }
    ]
  };
}

class StoreDatabase {
  constructor() {
    this.data = this.read();
  }

  read() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Error reading database, resetting to initial defaults:", e);
    }
    const initial = getInitialData();
    this.write(initial);
    return initial;
  }

  write(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      this.data = data;
    } catch (e) {
      console.error("Failed to write to database:", e);
    }
  }

  // --- PRODUCTS ---
  getProducts() {
    return this.data.products;
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id);
  }

  addProduct(product) {
    const id = "prod-" + Date.now();
    const newProduct = {
      id,
      sku: product.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: product.name,
      nameEn: product.nameEn || "",
      category: product.category || "عام",
      price: parseFloat(product.price) || 0,
      salePrice: product.salePrice ? parseFloat(product.salePrice) : null,
      costPrice: product.costPrice ? parseFloat(product.costPrice) : parseFloat(product.price) * 0.5,
      stock: parseInt(product.stock, 10) || 0,
      lowStockThreshold: parseInt(product.lowStockThreshold, 10) || 5,
      rating: 5.0,
      reviewsCount: 1,
      description: product.description || "",
      image: product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      status: product.status || "active",
      createdAt: new Date().toISOString()
    };

    this.data.products.unshift(newProduct);

    // Log initial stock creation
    if (newProduct.stock > 0) {
      this.addInventoryLog({
        productId: newProduct.id,
        productName: newProduct.name,
        sku: newProduct.sku,
        type: "توريد",
        change: newProduct.stock,
        previousStock: 0,
        newStock: newProduct.stock,
        reason: "توريد ابتدائي مع إضافة المنتج الجديد"
      });
    }

    this.write(this.data);
    return newProduct;
  }

  updateProduct(id, updates) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const current = this.data.products[index];
    const prevStock = current.stock;
    const newStock = updates.stock !== undefined ? parseInt(updates.stock, 10) : prevStock;

    const updated = {
      ...current,
      ...updates,
      price: updates.price !== undefined ? parseFloat(updates.price) : current.price,
      salePrice: updates.salePrice !== undefined ? (updates.salePrice ? parseFloat(updates.salePrice) : null) : current.salePrice,
      costPrice: updates.costPrice !== undefined ? parseFloat(updates.costPrice) : current.costPrice,
      stock: newStock,
      lowStockThreshold: updates.lowStockThreshold !== undefined ? parseInt(updates.lowStockThreshold, 10) : current.lowStockThreshold,
      updatedAt: new Date().toISOString()
    };

    this.data.products[index] = updated;

    // If stock changed directly via product edit form, log it
    if (newStock !== prevStock) {
      const diff = newStock - prevStock;
      this.addInventoryLog({
        productId: id,
        productName: updated.name,
        sku: updated.sku,
        type: diff > 0 ? "توريد" : "تعديل",
        change: diff,
        previousStock: prevStock,
        newStock: newStock,
        reason: updates.stockChangeReason || "تعديل يدوي للمخزون من لوحة الإدارة"
      });
    }

    this.write(this.data);
    return updated;
  }

  deleteProduct(id) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    const removed = this.data.products.splice(index, 1)[0];
    this.addInventoryLog({
      productId: id,
      productName: removed.name,
      sku: removed.sku,
      type: "حذف",
      change: -removed.stock,
      previousStock: removed.stock,
      newStock: 0,
      reason: "حذف المنتج من الكتالوج بواسطة الإدارة"
    });
    this.write(this.data);
    return true;
  }

  // --- STOCK TRACKING & ADJUSTMENT ---
  adjustStock(productId, change, reason = "تعديل يدوي", note = "") {
    const product = this.getProductById(productId);
    if (!product) {
      throw new Error("المنتج غير موجود");
    }

    const previousStock = product.stock;
    const newStock = Math.max(0, previousStock + parseInt(change, 10));

    product.stock = newStock;
    product.updatedAt = new Date().toISOString();

    const log = this.addInventoryLog({
      productId,
      productName: product.name,
      sku: product.sku,
      type: change > 0 ? "توريد" : "تعديل",
      change: parseInt(change, 10),
      previousStock,
      newStock,
      reason: note ? `${reason}: ${note}` : reason
    });

    this.write(this.data);
    return { product, log };
  }

  addInventoryLog({ productId, productName, sku, type, change, previousStock, newStock, reason }) {
    const log = {
      id: "log-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      productId,
      productName,
      sku,
      type,
      change,
      previousStock,
      newStock,
      reason,
      timestamp: new Date().toISOString()
    };
    if (!this.data.inventoryLogs) {
      this.data.inventoryLogs = [];
    }
    this.data.inventoryLogs.unshift(log);
    if (this.data.inventoryLogs.length > 500) {
      this.data.inventoryLogs = this.data.inventoryLogs.slice(0, 500);
    }
    return log;
  }

  getInventoryLogs(limit = 100) {
    return (this.data.inventoryLogs || []).slice(0, limit);
  }

  // --- ORDERS & CHECKOUT WITH AUTOMATIC STOCK DECREMENT ---
  createOrder(orderData) {
    const { customer, items, paymentMethod, notes, discount = 0, shipping = 0 } = orderData;

    if (!items || !items.length) {
      throw new Error("لا يمكن إتمام طلب فارغ بدون منتجات");
    }

    // Stock verification
    for (const item of items) {
      const product = this.getProductById(item.id);
      if (!product) {
        throw new Error(`المنتج "${item.name}" لم يعد متوفراً في المتجر.`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`المخزون غير كافٍ للمنتج "${product.name}". المتوفر حالياً: ${product.stock} فقط.`);
      }
    }

    let subtotal = 0;
    const processedItems = items.map(item => {
      const product = this.getProductById(item.id);
      const effectivePrice = product.salePrice !== null ? product.salePrice : product.price;
      const lineTotal = effectivePrice * item.quantity;
      subtotal += lineTotal;
      return {
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: effectivePrice,
        quantity: item.quantity,
        image: product.image,
        lineTotal
      };
    });

    const total = Math.max(0, subtotal - discount + shipping);
    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = "SH-2026-" + Math.floor(1000 + Math.random() * 9000);

    // Decrement stock & record audit logs
    for (const item of processedItems) {
      const product = this.getProductById(item.id);
      const prevStock = product.stock;
      product.stock -= item.quantity;

      this.addInventoryLog({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        type: "بيع",
        change: -item.quantity,
        previousStock: prevStock,
        newStock: product.stock,
        reason: `طلب شراء جديد #${orderId} (${customer.name})`
      });
    }

    const order = {
      id: orderId,
      trackingNumber,
      customer,
      items: processedItems,
      subtotal,
      discount,
      shipping,
      total,
      paymentMethod: paymentMethod || "الدفع عند الاستلام",
      status: "قيد الانتظار",
      notes: notes || "",
      createdAt: new Date().toISOString()
    };

    if (!this.data.orders) {
      this.data.orders = [];
    }
    this.data.orders.unshift(order);
    this.write(this.data);
    return order;
  }

  getOrders() {
    return this.data.orders || [];
  }

  getOrderById(id) {
    return (this.data.orders || []).find(o => o.id === id || o.trackingNumber === id);
  }

  updateOrderStatus(orderId, status, restock = false) {
    const order = (this.data.orders || []).find(o => o.id === orderId);
    if (!order) return null;

    const oldStatus = order.status;
    order.status = status;
    order.updatedAt = new Date().toISOString();

    // Restock if cancelled
    if (status.includes("ملغي") && !oldStatus.includes("ملغي") && restock) {
      for (const item of order.items) {
        const product = this.getProductById(item.id);
        if (product) {
          const prevStock = product.stock;
          product.stock += item.quantity;
          this.addInventoryLog({
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            type: "توريد",
            change: item.quantity,
            previousStock: prevStock,
            newStock: product.stock,
            reason: `إلغاء الطلب وإعادة القطع للمخزون #${order.id}`
          });
        }
      }
    }

    this.write(this.data);
    return order;
  }

  getStats() {
    const products = this.data.products || [];
    const orders = this.data.orders || [];
    const logs = this.data.inventoryLogs || [];

    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold);
    const outOfStockProducts = products.filter(p => p.stock === 0);
    const inStockProducts = products.filter(p => p.stock > p.lowStockThreshold);

    const totalInventoryUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const totalInventoryAssetValue = products.reduce((acc, p) => acc + ((p.stock || 0) * (p.costPrice || p.price * 0.5)), 0);
    const totalRetailPotentialValue = products.reduce((acc, p) => acc + ((p.stock || 0) * (p.salePrice || p.price)), 0);

    const completedOrders = orders.filter(o => !o.status.includes("ملغي"));
    const totalRevenue = completedOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === "قيد الانتظار" || o.status === "قيد التجهيز").length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      totalProducts,
      totalInventoryUnits,
      totalInventoryAssetValue,
      totalRetailPotentialValue,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      inStockCount: inStockProducts.length,
      lowStockItems: lowStockProducts,
      outOfStockItems: outOfStockProducts,
      recentLogs: logs.slice(0, 10)
    };
  }

  reset() {
    const initial = getInitialData();
    this.write(initial);
    return initial;
  }
}

export const db = new StoreDatabase();
