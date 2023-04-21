import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { TelBot } from "./bot.schema";
import { Model } from "mongoose";
import axios from "axios";

import * as TelegramBot from "node-telegram-bot-api";


@Injectable()
export class BotServices {
    constructor(
        @InjectModel('Bot') private readonly botModel: Model<TelBot>,
    ) {
    }
    async getMybots(ownerId: string) {
        const bots = await this.botModel.find({ ownerId })

        return bots
    }
    async getBot(ownerId: string, botId: string) {
        try {
            const bot = await this.botModel.findOne({ ownerId, _id: botId })
            if (!bot) {
                throw new HttpException('bot not found', HttpStatus.NOT_FOUND)
            }
            const updatedBot = await this.generateBotInfo(bot, ownerId)

            await this.botModel.updateOne({ _id: bot._id }, updatedBot)

            return bot
        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createBot(ownerId: string, bot: TelBot) {
        try {
            const exists = await this.botModel.find({ $or: [{ name: bot.name }, { apiKey: bot.apiKey }] })
            if (exists.length > 0) {

                throw new HttpException('bot token or bot name exists', HttpStatus.CONFLICT)
            }

            const obj = await this.generateBotInfo(bot, ownerId)
            const newbot = await this.botModel.create(obj)
            newbot.save()
        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteBot(ownerId: string, botId: string) {

        try {
            const [exist] = await this.botModel.find({ ownerId, _id: botId })
            if (!exist) {

                throw new HttpException('bot not found', 404)
            }

            await this.botModel.deleteOne({ _id: botId, ownerId })


        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
    async updateBotNames(ownerId: string, updateBotNames: { name: string, apiKey: string }) {
        try {
            const { name, apiKey } = updateBotNames

            if (name) {
                await this.botModel.updateOne({ ownerId, apiKey: apiKey }, { name: name })
            }

        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
  
    async generateBotInfo(bot: TelBot, ownerId: string) {
        try {
            const botObj = new TelegramBot(bot.apiKey, { polling: false });
            const info = await botObj.getMe()
            const profile = await axios.post(`https://api.telegram.org/bot${bot.apiKey}/getUserProfilePhotos`, {
                user_id: info.id,
            })
                .then(response => {
                    const photos = response.data.result.photos;

                    if (photos.length > 0) {

                        const photo = photos[photos.length - 1];
                        const fileId = photo[0].file_id;


                        return axios.post(`https://api.telegram.org/bot${bot.apiKey}/getFile`, {
                            file_id: fileId,
                        });
                    }
                })
                .then(response => {
                    if (response) {
                        const file = response.data.result;
                        const fileUrl = `https://api.telegram.org/file/bot${bot.apiKey}/${file.file_path}`;

                        return (fileUrl);
                    }
                })
                .catch(error => {
                    console.error(error);
                    return null
                });



            const obj: TelBot = {
                telegram_name: info.first_name,
                name: bot.name,
                apiKey: bot.apiKey,
                ownerId,
                messages: [],
                profile,
                description: '',
                bot_id: info.id
            }
            return obj
        } catch (err) {
            console.log(err)
            throw new HttpException(err.message || "internal error in obtain botinfo", err.status || 501)
        }


    }
}