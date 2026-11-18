/**
 * Client-Side Real-Time Sound & Push Notification Utilities for Souq Heba
 */

// Synthesize pleasant 2-tone cash register / order chime using Web Audio API
export const playOrderNotificationSound = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Tone 1: High crisp bell (880 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: Harmonious high chime (1318.5 Hz - E6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.5, now + 0.12);
    gain2.gain.setValueAtTime(0.45, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.75);
  } catch (e) {
    console.warn("Could not play synthesized audio chime:", e);
  }
};

// Vibrate mobile device (if supported)
export const vibrateMobileDevice = () => {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate([250, 100, 250, 100, 400]);
    }
  } catch (e) {
    console.warn("Vibration not supported or disallowed:", e);
  }
};

// Request Browser Push Notification permission
export const requestPushPermission = async () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission; // 'granted' | 'denied' | 'default'
  } catch (e) {
    return 'error';
  }
};

// Show Native Mobile / Desktop Push Notification
export const showOrderPushNotification = (order) => {
  try {
    vibrateMobileDevice();
    playOrderNotificationSound();

    if ('Notification' in window && Notification.permission === 'granted') {
      const title = `🛒 طلب شراء جديد #${order.id}!`;
      const body = `العميل: ${order.customer?.name} (${order.customer?.address || 'مصر'})\nالمبلغ المطلوب كاش: ${Number(order.total).toLocaleString('en-US')} ج.م`;

      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: order.id,
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  } catch (e) {
    console.warn("Push notification error:", e);
  }
};

// Generate Direct WhatsApp URL for store admin to message customer or receive alert
export const generateWhatsAppOrderLink = (order, adminPhone = '201000000000') => {
  const cleanPhone = adminPhone.replace(/[^0-9]/g, '');
  const itemsSummary = (order.items || []).map(i => `• ${i.name} (×${i.quantity})`).join('\n');
  const text = `🛍️ *طلب جديد في سوق هبة #${order.id}*\n` +
    `👤 *العميل:* ${order.customer?.name}\n` +
    `📱 *الهاتف:* ${order.customer?.phone}\n` +
    `📍 *العنوان:* ${order.customer?.address}\n` +
    `💵 *المبلغ المطلوب كاش:* ${Number(order.total).toLocaleString('en-US')} ج.م\n` +
    `📦 *المنتجات:*\n${itemsSummary}`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};
