import { NextApiRequest, NextApiResponse } from "next";
import TelegramBot from "node-telegram-bot-api";
import crypto from "crypto";
import { IncomingHttpHeaders } from "http";

const botToken = process.env.TELEGRAM_API_KEY;
const chatId = process.env.TELEGRAM_CHAT_ID;
const bot = new TelegramBot(botToken as string, { polling: false });

type SentryWebhookPayload = {
  action: string;
  installation: {
    uuid: string;
  };
  data: Record<string, unknown>;
  actor: { id: string; type: string; name: string };
};

function verifySignature(
  request: {
    body: unknown;
    headers: IncomingHttpHeaders;
  },
  secret: string = ""
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const bodyString = JSON.stringify(request.body);
  hmac.update(bodyString, "utf8");
  const digest = hmac.digest("hex");
  return digest === request.headers["sentry-hook-signature"];
}

const sentryWebhookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const sentryWebhookSecret = process.env.SENTRY_WEBHOOK_SECRET || "";

  if (req.method === "POST" && verifySignature(req, sentryWebhookSecret)) {
    const payload = req.body as SentryWebhookPayload;

    if (payload && payload.data) {
      const errorMessage = `Error: ${JSON.stringify(payload.data)}`;
      await bot.sendMessage(chatId as string, errorMessage);
    }

    res.status(200).json({ message: "Webhook processed successfully." });
  } else {
    res.status(401).json({ message: "Unauthorized or method not allowed." });
  }
};

export default sentryWebhookHandler;
