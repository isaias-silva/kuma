import * as mongoose from 'mongoose';

export const TelegramBotSchema = new mongoose.Schema({

    name: { type: String, require: true },
    ownerId: { type: String, require: true },
    apiKey: { type: String },

});

export interface TelBot {

    name: string,
    ownerId: string
    apiKey: string
}