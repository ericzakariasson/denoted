import { Transport, Envelope, Event, TransportMakeRequestResponse, BaseTransportOptions } from "@sentry/types";
import TelegramBot from "node-telegram-bot-api";

export class TelegramTransport implements Transport {
  private bot: TelegramBot;
  private chatId: string;

  constructor(options: BaseTransportOptions & { botToken: string; chatId: string }) {
    const { botToken, chatId } = options;
    this.bot = new TelegramBot(botToken, { polling: false });
    this.chatId = chatId;
  }

  async send(envelope: Envelope): Promise<void | TransportMakeRequestResponse> {
    const items = envelope[1];
    for (const item of items) {
      const itemHeader = item[0];
      if (itemHeader.type === "event" || itemHeader.type === "transaction" || itemHeader.type === "profile") {
        const event = item[1] as Event;
        if (event && event.message) {
          const errorMessage = `Error: ${event.message}\n\n${JSON.stringify(event)}`;
          await this.bot.sendMessage(this.chatId, errorMessage);
        }
      }
    }
    return { statusCode: 200 };
  }

  async flush(_timeout?: number): Promise<boolean> {
    return true;
  }
}
