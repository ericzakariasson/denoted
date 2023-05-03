import { NextApiRequest, NextApiResponse } from 'next';
import TelegramBot from 'node-telegram-bot-api';

const botToken = process.env.TELEGRAM_API_KEY;
const chatId = process.env.TELEGRAM_CHAT_ID;
const bot = new TelegramBot(botToken as string, { polling: false });

const sentryWebhookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'POST') {
    const event = req.body;

    if (event && event.message) {
      const errorMessage = `Error: ${event.message} ${JSON.stringify(event)}`;
      await bot.sendMessage(chatId as string, errorMessage);
    }

    res.status(200).json({ message: 'Webhook processed successfully.' });
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
};

export default sentryWebhookHandler;
