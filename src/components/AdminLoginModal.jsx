import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function AdminLoginModal() {
  const { isAdminLoginModalOpen, setIsAdminLoginModalOpen, adminLogin } = useShop();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password.trim()) {
      setErrorMessage('يرجى كتابة كلمة المرور');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminLogin(password);
      setPassword('');
    } catch (err) {
      setErrorMessage(err.message || 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrorMessage(null);
    setPassword('');
    setIsAdminLoginModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 text-right">
        {/* زر الإغلاق */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* رأس النافذة */}
        <div className="p-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-600/30">
            <Lock className="w-8 h-8 text-amber-300" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-1">
            تسجيل دخول إدارة متجر سوق هبة
          </h3>
          <p className="text-xs text-slate-500">
            أدخل كلمة المرور لإدارة كتالوج المنتجات وتتبع المخزون والطلبات
          </p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              كلمة مرور المشرف / الإدارة:
            </label>
            <div className="relative">
              <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder="أدخل كلمة المرور..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono text-left"
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

          {/* تلميح كلمة المرور الافتراضية */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>كلمة المرور الافتراضية:</span>
            </div>
            <button
              type="button"
              onClick={() => setPassword('admin123')}
              className="font-mono font-black text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-300 hover:bg-amber-100 transition cursor-pointer"
              title="انقر لتعبئة كلمة المرور تلقائياً"
            >
              admin123
            </button>
          </div>

          {/* أزرار الإجراءات */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري التحقق...' : 'تسجيل الدخول إلى لوحة الإدارة'}</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="w-full mt-2 py-2 text-slate-500 hover:text-slate-700 text-xs font-bold transition cursor-pointer text-center block"
            >
              الرجوع إلى متجر الزبائن
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
