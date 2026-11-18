import React, { useState, useRef } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Search,
  Package,
  UploadCloud,
  FileImage,
  RefreshCw,
  FolderOpen,
  Link,
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { PRESET_IMAGES } from '../../data/presetImages';
import { formatCurrency } from '../../utils/format';

export default function AdminProducts({ isAddModalOpen, setIsAddModalOpen }) {
  const { products, addProduct, updateProduct, deleteProduct } = useShop();

  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image source mode: 'device' (default!) | 'presets' | 'url'
  const [imageSourceMode, setImageSourceMode] = useState('device');
  const [selectedPresetTab, setSelectedPresetTab] = useState(PRESET_IMAGES[0].category);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    category: 'عطور وعود',
    sku: '',
    price: '',
    salePrice: '',
    costPrice: '',
    stock: '15',
    lowStockThreshold: '5',
    description: '',
    image: '',
    status: 'active'
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setImageSourceMode('device');
    setUploadedFileName('');
    setFormData({
      name: '',
      nameEn: '',
      category: 'عطور وعود',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      price: '',
      salePrice: '',
      costPrice: '',
      stock: '15',
      lowStockThreshold: '5',
      description: '',
      image: '',
      status: 'active'
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setImageSourceMode(product.image && product.image.startsWith('/uploads') ? 'device' : 'presets');
    setUploadedFileName(product.image && product.image.startsWith('/uploads') ? product.image.split('/').pop() : '');
    setFormData({
      name: product.name,
      nameEn: product.nameEn || '',
      category: product.category,
      sku: product.sku,
      price: product.price.toString(),
      salePrice: product.salePrice ? product.salePrice.toString() : '',
      costPrice: product.costPrice ? product.costPrice.toString() : '',
      stock: product.stock.toString(),
      lowStockThreshold: product.lowStockThreshold.toString(),
      description: product.description || '',
      image: product.image,
      status: product.status || 'active'
    });
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Process file upload from device
  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP, GIF)');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 20 ميجابايت.');
      return;
    }

    setIsUploadingImage(true);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target.result;

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Data,
            filename: file.name
          })
        });

        const data = await res.json();
        if (data.success) {
          setFormData(prev => ({ ...prev, image: data.url }));
        } else {
          // fallback to base64 data url directly
          setFormData(prev => ({ ...prev, image: base64Data }));
        }
      } catch (err) {
        console.warn("Upload API failed, using client data URL fallback:", err);
        setFormData(prev => ({ ...prev, image: base64Data }));
      } finally {
        setIsUploadingImage(false);
      }
    };

    reader.onerror = () => {
      alert('حدث خطأ أثناء قراءة الصورة من جهازك.');
      setIsUploadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert('يرجى كتابة اسم المنتج وسعر البيع.');
      return;
    }

    if (!formData.image) {
      alert('يرجى اختيار أو رفع صورة للمنتج من جهازك أولاً.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await addProduct(formData);
      }
      closeModal();
    } catch (err) {
      alert(err.message || 'خطأ أثناء حفظ المنتج');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (confirm(`هل أنت متأكد من حذف المنتج "${name}" من المتجر؟ سيتم تصفير المخزون المتبقي له.`)) {
      try {
        await deleteProduct(id);
      } catch (err) {
        alert(err.message || 'حدث خطأ أثناء حذف المنتج');
      }
    }
  };

  const filteredProducts = products.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
      p.sku.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 text-right" dir="rtl">
      {/* الرأس العلوي */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>إدارة كتالوج المنتجات (إضافة وتعديل المنتجات)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            طرح منتجات جديدة، رفع الصور مباشرة من جهازك، وضبط الأسعار والمخزون.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة / طرح منتج جديد</span>
        </button>
      </div>

      {/* شريط البحث */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث بالعنوان، الكود SKU، أو القسم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>
        <span className="text-xs text-slate-500 font-bold">
          عرض {filteredProducts.length} من أصل {products.length} منتج
        </span>
      </div>

      {/* شبكة بطاقات المنتجات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => {
          const price = product.salePrice !== null ? product.salePrice : product.price;
          const isOutOfStock = product.stock <= 0;
          const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {product.category}
                      </span>
                      <span className="font-mono">{product.sku}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate" title={product.name}>
                      {product.name}
                    </h4>
                    {product.nameEn && (
                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        {product.nameEn}
                      </p>
                    )}
                  </div>
                </div>

                {/* الأسعار والمخزون */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs mb-3">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold">سعر البيع</span>
                    <strong className="text-slate-900 font-black">{formatCurrency(price)}</strong>
                    {product.salePrice && (
                      <span className="text-[10px] text-slate-400 line-through mr-1">{formatCurrency(product.price)}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold">رصيد المخزون</span>
                    <span className={`font-black font-mono ${
                      isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-slate-800'
                    }`}>
                      {product.stock} قطعة
                    </span>
                    <span className="text-[10px] text-slate-400 mr-1">(الحد {product.lowStockThreshold})</span>
                  </div>
                </div>
              </div>

              {/* أزرار التعديل والحذف */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(product)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>تعديل</span>
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="px-2.5 py-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  title="حذف المنتج نهائياً"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* نافذة إضافة / تعديل منتج مع دعم الرفع من الجهاز */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col text-right">
            {/* الرأس */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة / طرح منتج جديد في المتجر'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingProduct ? `تحديث كود ${editingProduct.sku}` : 'أدخل بيانات المنتج، ارفع صورته من جهازك، وحدد المخزون'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* محتوى النموذج */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              {/* الأسماء */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم المنتج (بالعربية) *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="مثال: دهن عود هندي فاخر معتق"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الاسم بالإنجليزية (اختياري)
                  </label>
                  <input
                    type="text"
                    name="nameEn"
                    placeholder="e.g. Royal Aged Indian Oud"
                    value={formData.nameEn}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-left focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* القسم وكود SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    القسم / الفئة *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  >
                    <option value="عطور وعود">عطور وعود</option>
                    <option value="أزياء وعبايات">أزياء وعبايات</option>
                    <option value="إلكترونيات">إلكترونيات</option>
                    <option value="قهوة ومأكولات فاخرة">قهوة ومأكولات فاخرة</option>
                    <option value="ديكور ومنزل">ديكور ومنزل</option>
                    <option value="مجوهرات وإكسسوارات">مجوهرات وإكسسوارات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    كود المنتج SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    placeholder="مثال: OUD-202"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-left focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* قسم صورة المنتج: رفع من الجهاز (الخيار الأساسي) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-slate-800">
                    صورة المنتج *
                  </label>

                  {/* أزرار التبديل بين المصادر */}
                  <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('device')}
                      className={`px-3 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                        imageSourceMode === 'device'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>رفع من جهازي</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('presets')}
                      className={`px-3 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                        imageSourceMode === 'presets'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>معرض جاهز</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('url')}
                      className={`px-3 py-1 rounded-md transition flex items-center gap-1 cursor-pointer ${
                        imageSourceMode === 'url'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Link className="w-3.5 h-3.5" />
                      <span>رابط URL</span>
                    </button>
                  </div>
                </div>

                {/* الخيار 1: رفع من الجهاز مباشرة (Device Upload) */}
                {imageSourceMode === 'device' && (
                  <div>
                    {/* حقل ملف مخفي */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {formData.image ? (
                      /* معاينة الصورة المرفوعة من الجهاز */
                      <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <img
                            src={formData.image}
                            alt="معاينة الصورة المرفوعة"
                            className="w-14 h-14 rounded-lg object-cover border border-slate-200 shadow-inner bg-slate-50 shrink-0"
                          />
                          <div>
                            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>تم تحديد الصورة من جهازك بنجاح</span>
                            </span>
                            {uploadedFileName && (
                              <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate max-w-xs">
                                {uploadedFileName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer"
                          >
                            تغيير الصورة
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, image: '' }));
                              setUploadedFileName('');
                            }}
                            className="px-2 py-1.5 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-lg transition cursor-pointer"
                            title="إزالة الصورة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* منطقة السحب والإفلات أو النقر للاختيار من الكمبيوتر/الهاتف */
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                          isDraggingOver
                            ? 'border-emerald-600 bg-emerald-50/70 scale-102'
                            : 'border-slate-300 hover:border-emerald-500 hover:bg-white bg-white/70'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 shadow-sm">
                          {isUploadingImage ? (
                            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                          ) : (
                            <UploadCloud className="w-6 h-6" />
                          )}
                        </div>

                        <h4 className="font-bold text-slate-800 text-sm mb-0.5">
                          {isUploadingImage ? 'جاري قراءة ورفع الصورة...' : 'اضغط هنا لاختيار صورة من جهازك'}
                        </h4>
                        <p className="text-xs text-slate-400">
                          أو اسحب ملف الصورة وأفلته داخل هذا المربع (JPG, PNG, WEBP)
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* الخيار 2: المعرض المسبق */}
                {imageSourceMode === 'presets' && (
                  <div className="border border-slate-200 rounded-xl p-3 bg-white">
                    <span className="text-[11px] font-bold text-slate-500 block mb-2">
                      اختر من المعرض الفاخر بنقرة واحدة:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {PRESET_IMAGES.map(cat => (
                        <button
                          key={cat.category}
                          type="button"
                          onClick={() => setSelectedPresetTab(cat.category)}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                            selectedPresetTab === cat.category
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat.category}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_IMAGES.find(c => c.category === selectedPresetTab)?.items.map(item => (
                        <button
                          key={item.url}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: item.url }))}
                          className={`group relative rounded-lg overflow-hidden aspect-video border-2 transition cursor-pointer ${
                            formData.image === item.url ? 'border-emerald-600 ring-2 ring-emerald-400' : 'border-transparent'
                          }`}
                        >
                          <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] p-0.5 truncate text-center font-bold">
                            {item.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* الخيار 3: رابط إنترنت */}
                {imageSourceMode === 'url' && (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      name="image"
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="معاينة"
                        className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* التسعير وإعدادات تتبع المخزون */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider block">
                  إعدادات التسعير وحساب أصول المخزون
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      سعر البيع الأساسي (ج.م) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      name="price"
                      placeholder="1450"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-left font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      سعر التخفيض (ج.م)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="salePrice"
                      placeholder="1250"
                      value={formData.salePrice}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-rose-600 text-left font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      سعر التكلفة (ج.م)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="costPrice"
                      placeholder="600"
                      value={formData.costPrice}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-left font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      كمية المخزون (قطع) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      name="stock"
                      placeholder="20"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-left font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      حد تنبيه نقص المخزون (بالقطع)
                    </label>
                    <input
                      type="number"
                      min="1"
                      name="lowStockThreshold"
                      value={formData.lowStockThreshold}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-left focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      سيتم إطلاق تنبيه عندما يصل رصيد المنتج لهذا العدد أو أقل.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      حالة المنتج في المتجر
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="active">نشط ومعروض للزبائن</option>
                      <option value="draft">مسودة / مخفي مؤقتاً</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* الوصف */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الوصف والمواصفات
                </label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="اكتب مواصفات المنتج، الخامة، بلد المنشأ، أو تعليمات الاستخدام..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 leading-relaxed"
                />
              </div>

              {/* أزرار الحفظ */}
              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'جاري الحفظ...' : editingProduct ? 'حفظ التعديلات' : 'نشر المنتج في المتجر'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
