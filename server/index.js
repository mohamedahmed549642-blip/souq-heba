import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { CATEGORIES } from './data/defaultProducts.js';
import { sendAdminOrderNotifications } from './notifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Uploads directory
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Admin Password (default: admin123)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

app.use(cors());
// Support generous payload limit for device picture uploads
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Serve uploaded device images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// --- ADMIN LOGIN ROUTE ---
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, error: 'يرجى إدخال كلمة المرور' });
  }

  if (password === ADMIN_PASSWORD) {
    const token = 'admin_session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
    return res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token
    });
  } else {
    return res.status(401).json({
      success: false,
      error: 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى'
    });
  }
});

// --- FILE UPLOAD FROM DEVICE ROUTE ---
app.post('/api/upload', (req, res) => {
  try {
    const { image, filename } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'لم يتم إرسال أي صورة' });
    }

    // Match data URI e.g. "data:image/jpeg;base64,..."
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If it's already a URL or path, return as is
      if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/uploads/')) {
        return res.json({ success: true, url: image });
      }
      return res.status(400).json({ success: false, error: 'بيانات الصورة المشفرة غير صالحة' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    let ext = mimeType.split('/')[1] || 'jpg';
    if (ext === 'jpeg') ext = 'jpg';
    if (ext.includes('svg')) ext = 'svg';
    if (ext.includes('webp')) ext = 'webp';

    const cleanBaseName = (filename || 'item').replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '').slice(0, 30);
    const uniqueFileName = `photo_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    res.json({
      success: true,
      url: publicUrl,
      filename: uniqueFileName,
      message: 'تم رفع الصورة وحفظها بنجاح'
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- PRODUCT ROUTES ---

// GET /api/products
app.get('/api/products', (req, res) => {
  try {
    let products = db.getProducts();
    const { category, search, stockStatus } = req.query;

    if (category && category !== 'جميع الأقسام' && category !== 'All Categories') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (stockStatus) {
      if (stockStatus === 'out') {
        products = products.filter(p => p.stock === 0);
      } else if (stockStatus === 'low') {
        products = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold);
      } else if (stockStatus === 'in') {
        products = products.filter(p => p.stock > p.lowStockThreshold);
      }
    }

    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/categories
app.get('/api/categories', (req, res) => {
  res.json({ success: true, categories: CATEGORIES });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'المنتج غير موجود' });
  }
  res.json({ success: true, product });
});

// POST /api/products (Admin creates product)
app.post('/api/products', (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, error: 'اسم المنتج وسعر البيع حقول مطلوبة.' });
    }
    const newProduct = db.addProduct(req.body);
    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/products/:id (Admin edits product)
app.put('/api/products/:id', (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'المنتج غير موجود' });
    }
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/products/:id (Admin deletes product)
app.delete('/api/products/:id', (req, res) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'المنتج غير موجود' });
  }
  res.json({ success: true, message: 'تم حذف المنتج بنجاح' });
});

// PATCH /api/products/:id/stock (Stock adjustment)
app.patch('/api/products/:id/stock', (req, res) => {
  try {
    const { change, reason, note } = req.body;
    if (change === undefined) {
      return res.status(400).json({ success: false, error: 'كمية تعديل المخزون مطلوبة' });
    }
    const result = db.adjustStock(req.params.id, change, reason, note);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- INVENTORY AUDIT LOGS ---
app.get('/api/inventory/logs', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 100;
  const logs = db.getInventoryLogs(limit);
  res.json({ success: true, count: logs.length, logs });
});

// --- ORDERS ROUTES ---

// GET /api/orders
app.get('/api/orders', (req, res) => {
  const orders = db.getOrders();
  res.json({ success: true, count: orders.length, orders });
});

// GET /api/orders/:id
app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'لم يتم العثور على طلب بهذا الرقم أو كود التتبع.' });
  }
  res.json({ success: true, order });
});

// POST /api/orders (Customer checkout with Real-Time Admin Notifications)
app.post('/api/orders', async (req, res) => {
  try {
    const order = db.createOrder(req.body);

    // Asynchronously dispatch mobile notifications to admin (Telegram / Push)
    try {
      const settings = db.getSettings();
      sendAdminOrderNotifications(order, settings).catch(err => {
        console.warn("Mobile notification background dispatch warning:", err);
      });
    } catch (notifErr) {
      console.warn("Could not dispatch mobile notification:", notifErr);
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- ADMIN SETTINGS & REAL-TIME MOBILE NOTIFICATION CONFIG ---
// GET /api/admin/settings
app.get('/api/admin/settings', (req, res) => {
  const settings = db.getSettings();
  res.json({ success: true, settings });
});

// POST /api/admin/settings
app.post('/api/admin/settings', (req, res) => {
  const settings = db.updateSettings(req.body);
  res.json({ success: true, settings, message: 'تم حفظ إعدادات إشعارات الإدارة بنجاح' });
});

// POST /api/admin/test-notification
app.post('/api/admin/test-notification', async (req, res) => {
  try {
    const settings = db.getSettings();
    const testOrder = {
      id: "ORD-TEST-" + Math.floor(1000 + Math.random() * 9000),
      trackingNumber: "SH-2026-TEST",
      customer: {
        name: "تجربة إشعار الإدارة",
        phone: settings.adminPhone || "01000000000",
        address: "القاهرة، جمهورية مصر العربية"
      },
      items: [
        { name: "عطر عود الماجد الملكي الفاخر (اختبار)", quantity: 1, price: 1250 }
      ],
      total: 1250,
      shipping: 0,
      paymentMethod: "الدفع عند الاستلام نقداً (كاش)",
      notes: "هذا إشعار تجريبي لاختبار وصول التنبيهات اللحظية لهاتف المشرف."
    };

    const results = await sendAdminOrderNotifications(testOrder, req.body || settings);
    res.json({
      success: true,
      results,
      message: results.telegram?.ok
        ? "تم إرسال إشعار تجريبي إلى هاتفك عبر تيليجرام بنجاح! 🚀"
        : "تم فحص إعدادات الإشعارات بنجاح."
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/orders/:id/status (Admin updates order status)
app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const { status, restock } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'الحالة مطلوبة' });
    }
    const order = db.updateOrderStatus(req.params.id, status, !!restock);
    if (!order) {
      return res.status(404).json({ success: false, error: 'الطلب غير موجود' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- STATS & OVERVIEW ---
app.get('/api/stats', (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/reset (Reset demo database)
app.post('/api/admin/reset', (req, res) => {
  const data = db.reset();
  res.json({ success: true, message: 'تمت إعادة تعيين قاعدة البيانات بنجاح', data });
});

// Serve frontend build if dist folder exists
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), err => {
    if (err) next();
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🛍️ Souq Heba Server is running on http://localhost:${PORT}`);
  });
}

export default app;
