import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const WEBHOOK_SECRET = 'MY_SUPER_SECRET_KEY';
const TELEGRAM_BOT_TOKEN = '8850150104:AAFAMLGST9BhakXwAGgUTK5SxVM9-uBqsw'; // Replace with real token when ready

// Helper function to send Telegram alert
async function sendTelegramAlert(chatId, message) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === '8850150104:AAFAMLGST9BhakXwAGgUTK5SxVM9-uBqsw') {
    console.warn('⚠️ Telegram Bot Token missing.');
    return;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });
    console.log(`✅ Telegram alert sent to Chat ID: ${chatId}`);
  } catch (error) {
    console.error('❌ Failed to send Telegram alert:', error.response?.data || error.message);
  }
}

// Webhook Route Listener
app.post('/api/webhook', async (req, res) => {
  // 1. SECURITY FIRST: Verify secret header before reading payload
  const webhookSecret = req.headers['x-webhook-secret'];
  if (webhookSecret !== WEBHOOK_SECRET) {
    return res.status(401).send('Unauthorized webhook source');
  }

  const payload = req.body;
  console.log('📬 Verified Webhook Received:', JSON.stringify(payload, null, 2));

  // 2. Handle UIL Approval Event
  if (payload.event === 'uil_letter_approved') {
    const { studentName, companyName, telegramChatId } = payload.data;
    
    const message = `🎉 <b>UIL Support Letter Approved!</b>\n\nDear ${studentName}, your official recommendation letter for <b>${companyName}</b> has been signed and stamped by the UIL Office. You can now download the PDF from your portal.`;
    
    if (telegramChatId) {
      await sendTelegramAlert(telegramChatId, message);
    }
  }

  // 3. Always return 200 OK immediately
  res.status(200).json({ received: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend server listening on http://localhost:${PORT}`));