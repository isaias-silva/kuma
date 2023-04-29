
import * as mongoose from 'mongoose';
import * as TelegramBot from "node-telegram-bot-api";

type Message = TelegramBot.Message
type Comand = TelegramBot.BotCommand & { flowId?: string }

export const TelegramBotSchema = new mongoose.Schema({

    name: { type: String, require: true },
    ownerId: { type: String, require: true },
    apiKey: { type: String },
    telegram_name: { type: String },
    messages: { type: Array<Message> },
    comands: { type: Array<Comand> },
    profile: { type: String },
    bot_id: { type: Number },
    description: { type: String }

});


export interface TelBot {
    profile: string,
    name: string,
    telegram_name: string,
    ownerId: string
    apiKey: string,
    bot_id: number,
    description?: string
    messages: Message[]
    comands: Comand[]
}