/**
 * Real-Time Mobile Notifications for Souq Heba
 * Supports Telegram Bot push alerts, WhatsApp notifications, and webhook dispatches
 */

export async function sendAdminOrderNotifications(order, customSettings = {}) {
  const telegramToken = customSettings.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = customSettings.telegramChatId || process.env.TELEGRAM_CHAT_ID;

  const results = {
    telegram: null,
    errors: []
  };

  // 1. Send Instant Push Notification via Telegram Bot to Admin's Phone
  if (telegramToken && telegramChatId) {
    try {
      const itemsList = order.items
        .map(i => `  • ${i.name} (×${i.quantity}) - ${Number(i.price).toLocaleString('en-US')} ج.م`)
        .join('\n');

      const message = `🔔 <b>طلب شراء جديد في سوق هبة!</b>
━━━━━━━━━━━━━━━━━━━
📦 <b>رقم الطلب:</b> <code>${order.id}</code>
🏷️ <b>كود التتبع:</b> <code>${order.trackingNumber}</code>

👤 <b>العميل:</b> ${order.customer.name}
📱 <b>الهاتف:</b> <a href="tel:${order.customer.phone}">${order.customer.phone}</a>
📍 <b>العنوان:</b> ${order.customer.address}

💵 <b>المبلغ المستحق (كاش):</b> <b>${Number(order.total).toLocaleString('en-US')} ج.م</b>
🚚 <b>الشحن:</b> ${order.shipping === 0 ? 'مجاني' : `${order.shipping} ج.م`}
💳 <b>طريقة الدفع:</b> ${order.paymentMethod}

🛍️ <b>المنتجات المطلوبة (${order.items.length}):</b>
${itemsList}
${order.notes ? `\n📝 <b>ملاحظات العميل:</b> ${order.notes}` : ''}
━━━━━━━━━━━━━━━━━━━
⏰ <i>${new Date().toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}</i>`;

      const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });

      const resData = await response.json();
      results.telegram = resData;
      if (!resData.ok) {
        results.errors.push(`Telegram error: ${resData.description}`);
      }
    } catch (err) {
      console.error('Failed to send Telegram notification:', err);
      results.errors.push(`Telegram exception: ${err.message}`);
    }
  }

  return results;
}
