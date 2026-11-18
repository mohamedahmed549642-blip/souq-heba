import React, { useState } from 'react';
import {
  Bell,
  Smartphone,
  Volume2,
  Send,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Radio,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { playOrderNotificationSound, vibrateMobileDevice } from '../../utils/notifications';

export default function AdminNotificationSettings() {
  const {
    adminSettings,
    updateAdminSettings,
    testAdminNotification,
    pushPermission,
    enablePushNotifications
  } = useShop();

  const [formData, setFormData] = useState({
    telegramBotToken: adminSettings.telegramBotToken || '',
    telegramChatId: adminSettings.telegramChatId || '',
    adminPhone: adminSettings.adminPhone || '01000000000',
    notifyOnNewOrder: adminSettings.notifyOnNewOrder !== false,
    enableSoundAlerts: adminSettings.enableSoundAlerts !== false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showTelegramHelp, setShowTelegramHelp] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setTestResult(null);
    try {
      await updateAdminSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      alert(err.message || 'فشل حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestChime = () => {
    playOrderNotificationSound();
    vibrateMobileDevice();
  };

  const handleTestTelegram = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testAdminNotification(formData);
      setTestResult({
        success: res.results?.telegram?.ok,
        message: res.message || 'تم اختبار الإشعار'
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'فشل إرسال الإشعار التجريبي'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* رأس الصفحة */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="bg-emerald-500/30 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              <span>تنبيهات فورية لحظية (Real-Time)</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black mb-1">
            إشعارات طلبات العملاء الفورية على هاتفك المحمول 📱
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            عند قيام أي عميل بإتمام طلب شراء في أي محافظة بمصر، سيصلك تنبيه فوري واهتزاز وصوت رنين على هاتفك يوضح بيانات العميل، العنوان، ورقم الجوال، والمبلغ المطلوب تحصيله كاش.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* القسم 1: إشعارات المتصفح وصوت الرنين للجوال والكمبيوتر */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                ١. صوت رنين الجرس وإشعارات الشاشة (Push Notifications)
              </h3>
              <p className="text-xs text-slate-500">
                يعمل مباشرة على هاتفك أو كمبيوترك عند فتح صفحة الإدارة
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* حالة إذن الإشعارات */}
            <div className="p-4 rounded-2xl border bg-slate-50 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-700 block">حالة إشعارات شاشة الجوال:</span>
                <span className={`text-xs font-black inline-flex items-center gap-1 mt-0.5 ${
                  pushPermission === 'granted' ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {pushPermission === 'granted' ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>مفعلة وتعمل بنجاح على هذا الجهاز</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>غير مفعلة بعد (اضغط لتفعيل الإذن)</span>
                    </>
                  )}
                </span>
              </div>

              {pushPermission !== 'granted' && (
                <button
                  type="button"
                  onClick={enablePushNotifications}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  تفعيل الإشعارات الآن
                </button>
              )}
            </div>

            {/* زر اختبار الصوت والاهتزاز */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white">
              <div>
                <h4 className="text-xs font-bold text-slate-800">صوت رنين الطلب والاهتزاز</h4>
                <p className="text-[11px] text-slate-400">نغمة مميزة تحاكي ماكينة الكاشير عند ورود أي طلب</p>
              </div>
              <button
                type="button"
                onClick={handleTestChime}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>تجربة الصوت 🔔</span>
              </button>
            </div>
          </div>
        </div>

        {/* القسم 2: إشعارات تطبيق تيليجرام على الموبايل (مجاني وفوري 100%) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <Send className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  ٢. إشعارات تطبيق تيليجرام المباشرة (Telegram Push)
                </h3>
                <p className="text-xs text-slate-500">
                  تصلك رسالة فورية مع صوت واهتزاز على تطبيق تيليجرام بهاتفك
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTelegramHelp(!showTelegramHelp)}
              className="text-xs text-sky-600 hover:text-sky-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>كيف أربطه في دقيقة؟</span>
            </button>
          </div>

          {/* دليل إعداد تيليجرام السريع */}
          {showTelegramHelp && (
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-slate-700 space-y-2 leading-relaxed">
              <strong className="block text-sky-900 font-black">خطوات تجهيز البوت المجاني في دقيقة:</strong>
              <ol className="list-decimal list-inside space-y-1 text-slate-600">
                <li>افتح تطبيق تيليجرام وابحث عن <strong>@BotFather</strong>.</li>
                <li>أرسل له أمر <code>/newbot</code>، واختر اسماً للبوت (مثلاً: <em>سوق هبة بوت</em>).</li>
                <li>سيعطيك رمز البوت <strong>(API Token)</strong>، انسخه وضعه في حقل "رمز بوت تيليجرام".</li>
                <li>ابحث في تيليجرام عن <strong>@userinfobot</strong> واضغط Start ليعطيك رقم الـ <strong>Id</strong> الخاص بك (Chat ID).</li>
                <li>افتح البوت الذي أنشأته واضغط <strong>Start</strong> لكي يستطيع مراسلتك.</li>
              </ol>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رمز بوت تيليجرام (Telegram Bot Token)
              </label>
              <input
                type="text"
                name="telegramBotToken"
                placeholder="مثال: 7123456789:AAHk..."
                value={formData.telegramBotToken}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-left focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                معرف المحادثة الخاص بك (Your Chat ID)
              </label>
              <input
                type="text"
                name="telegramChatId"
                placeholder="مثال: 123456789"
                value={formData.telegramChatId}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-left focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم هاتف المشرف للتواصل السريع (مصر)
              </label>
              <input
                type="text"
                name="adminPhone"
                placeholder="مثال: 01012345678"
                value={formData.adminPhone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-left focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {testResult.message}
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                ✅ تم حفظ إعدادات الإشعارات بنجاح!
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer text-center"
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
              </button>

              <button
                type="button"
                onClick={handleTestTelegram}
                disabled={isTesting || !formData.telegramBotToken || !formData.telegramChatId}
                className="py-3 px-4 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isTesting ? 'جاري الإرسال...' : 'إرسال إشعار تجريبي لهاتفي 🚀'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
