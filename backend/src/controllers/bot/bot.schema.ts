
import * as mongoose from 'mongoose';

export const TelegramBotSchema = new mongoose.Schema({

    name: { type: String, require: true },
    ownerId: { type: String, require: true },
    apiKey: { type: String },
    telegram_name: { type: String },
    messages: [],
    profile: { type: String },
    bot_id: { type: Number }

});
type messages = {
    contact: string
    message_item: string
    profile: string
}

export interface TelBot {
    profile: string,
    name: string,
    telegram_name: string,
    ownerId: string
    apiKey: string,
    bot_id: number,
    messages: []
}