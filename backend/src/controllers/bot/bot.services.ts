import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { TelBot } from "./bot.schema";
import { Model } from "mongoose";
import axios from "axios";

@Injectable()
export class BotServices {
    constructor(
        @InjectModel('Bot') private readonly botModel: Model<TelBot>,
    ) {
    }
    async getMybots(ownerId: string) {
        const bots = await this.botModel.find({ ownerId })
        return bots.map((value) => {
            const bot = {
                name: value.name,
                apiKey: value.apiKey,
                id: value._id
            }
            return bot
        })
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
                console.log(exists)
                throw new HttpException('bot token or bot name exists', HttpStatus.CONFLICT)
            }

            const test = await axios.get(`https://api.telegram.org/bot${bot.apiKey}/getMe`)
                .then((res) => res)
                .catch((err) => err.response)


            if (test.status != 200) {
                throw new HttpException('invalid api key', HttpStatus.BAD_REQUEST)
            }

            const obj = {
                name: bot.name,
                apiKey: bot.apiKey,
                ownerId
            }

            const newbot = await this.botModel.create(obj)
            newbot.save()
        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteBot(ownerId: string, botId: string) {

        try {
            const exist = await this.botModel.findById(botId)
            if (!exist) {
                throw new HttpException('bot not found', 404)
            }

            await this.botModel.deleteOne({ _id: botId })


        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
}