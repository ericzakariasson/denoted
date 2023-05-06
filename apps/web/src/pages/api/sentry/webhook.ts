import { NextApiRequest, NextApiResponse } from "next";
import TelegramBot from "node-telegram-bot-api";
import crypto from "crypto";
import type { Readable } from 'node:stream';

const botToken = process.env.TELEGRAM_API_KEY;
const chatId = process.env.TELEGRAM_CHAT_ID;
const topicId = process.env.TELEGRAM_TOPIC_ID;
const bot = new TelegramBot(botToken as string, { polling: false });

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

type SentryWebhookPayloadData = {
  resource: "issue";
  issue: {
    id: string;
    title: string;
    culprit: string;
  };
} | {
  resource: "event_alert";
  event: {
    title: string;
    culprit: string;
    web_url: string;
  };
};

function verifySignature(
  { headers }: NextApiRequest,
  rawBody: string,
  secret: string = ""
) : boolean {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody, "utf8");
  const digest = hmac.digest("hex");
  return digest === headers["sentry-hook-signature"];
}

export default async function sentryWebhookHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const sentryWebhookSecret = process.env.SENTRY_WEBHOOK_SECRET || "";

  const buf = await buffer(req);
  const rawBody = buf.toString('utf8');
  
  if (req.method === "POST" && verifySignature(req, rawBody, sentryWebhookSecret)) {
    const body = JSON.parse(rawBody);
    const data = { ...body.data, resource: req.headers["sentry-hook-resource"] } as SentryWebhookPayloadData;

    const getErrorMsg = () => {
      switch (data.resource) {
        case "issue":
          return `🚨${data.issue.title}
${data.issue.culprit}
https://denoted.sentry.io/issues/${data.issue.id}/`;
        case "event_alert":
          return `🚨${data.event.title}
${data.event.culprit}
${data.event.web_url}`;
      }
    };
    await bot.sendMessage(chatId as string, getErrorMsg(), {
      message_thread_id: Number(topicId)
    });

    res.status(200).json({ message: "Webhook processed successfully." });
  } else {
    res.status(401).json({ message: "Unauthorized or method not allowed." });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};