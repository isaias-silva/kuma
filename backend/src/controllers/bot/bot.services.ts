import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { TelBot } from "./bot.schema";
import { Model } from "mongoose";
import axios from "axios";

import * as TelegramBot from 'node-telegram-bot-api';


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
    async generateBotInfo(bot: TelBot, ownerId: string) {
        const test = await axios.get(`https://api.telegram.org/bot${bot.apiKey}/getMe`)
            .then((res) =>
                res)
            .catch((err) => err.response)

        if (test.status != 200) {
            throw new HttpException('invalid api key', HttpStatus.BAD_REQUEST)
        }

        const message_data = await axios.get(`https://api.telegram.org/bot${bot.apiKey}/getUpdates`).then(response => {
            return response.data.result;
        }).catch((err) => {
            throw new HttpException("error in obtain messages", err.response.status)
        })

        const botTest = new TelegramBot(bot.apiKey, { polling: true })
        const info = await botTest.getMe()
        const profiles = await botTest.getUserProfilePhotos(info.id)

        const profile = profiles.photos.length > 0 ? await botTest.getFileLink(profiles.photos[0][0].file_id) : null


        const obj: TelBot = {
            telegram_name: info.first_name,
            name: bot.name,
            apiKey: bot.apiKey,
            ownerId,
            messages: message_data,
            profile,
            bot_id:info.id
        }
        return obj
    }
}