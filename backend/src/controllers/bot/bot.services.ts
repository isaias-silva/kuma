import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { TelBot } from "./bot.schema";
import { Model } from "mongoose";
import axios, { HttpStatusCode } from "axios";

import * as TelegramBot from "node-telegram-bot-api";


@Injectable()
export class BotServices {
    botInstance?: TelegramBot;
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
    async updateBotNames(ownerId: string, updateBotNames: { name: string, apiKey: string }) {
        try {
            const { name, apiKey } = updateBotNames

            if (name) {
                const bot = await this.botModel.findOne({ apiKey, ownerId })
                if (!bot) {
                    throw new HttpException('bot not exists', HttpStatus.NOT_FOUND)
                }
                await this.botModel.updateOne({ _id: bot._id }, { name: name })
            }

        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    async deleteBotCommand(apiKey: string, command: string) {
        try {
            this.botInstance = new TelegramBot(apiKey)
            if (!this.botInstance) {
                throw new HttpException("Error in telegram network. retry again.", HttpStatusCode.InternalServerError)
            }
            const commands = await this.botInstance.getMyCommands()


            const [commandRm] = commands.filter((value) => value.command == command)
            if (!commandRm) {
                throw new HttpException("command don't exists.", HttpStatusCode.BadRequest)
            }
            commands.splice(commands.indexOf(commandRm), 1)
            await this.botInstance.setMyCommands(commands)

            const botDb = await this.botModel.findOne({ apiKey })
            if (!botDb) {
                throw "error in updated bot info."
            }
            await this.updateBotInfo(botDb._id.toString())
        }

        catch (err) {
            throw new HttpException(err.message || "internal error in delete bot command", err.status || 501)
        }
    }
    async createBotCommand(apiKey: string, command: string, description: string) {
        try {
            this.botInstance = new TelegramBot(apiKey)
            if (!this.botInstance) {
                throw new HttpException("Error in telegram network. retry again.", HttpStatusCode.InternalServerError)
            }
            const commands = await this.botInstance.getMyCommands()
            const [commandRm] = commands.filter((value) => value.command == command)
            if (commandRm) {
                throw new HttpException("command name has exists.", HttpStatusCode.BadRequest)
            }

            commands.push({ command: command, description })
            await this.botInstance.setMyCommands(commands)

            const botDb = await this.botModel.findOne({ apiKey })
            if (!botDb) {
                throw "error in updated bot info."
            }
            await this.updateBotInfo(botDb._id.toString())

        }
        catch (err) {
            throw new HttpException(err.message || "internal error in delete bot command", err.status || 501)
        }
    }

    async updateBotInfo(id: string) {
        const bot = await this.botModel.findById(id)
        if (!bot) {
            return
        }
        const updatedBot = await this.generateBotInfo(bot, bot.ownerId)
        await this.botModel.updateOne({ _id: bot._id }, updatedBot)
    }
    async generateBotInfo(bot: TelBot, ownerId: string) {
        try {

            this.botInstance = new TelegramBot(bot.apiKey, { polling: false });

            const info = await this.botInstance.getMe()
            const comands = await this.botInstance.getMyCommands()
            const profiles = (await this.botInstance.getUserProfilePhotos(info.id))
            const file_id = profiles.photos.length > 0 ? profiles.photos[0][0].file_id : null
            const profile = file_id ? await this.botInstance.getFileLink(file_id) : null





            const obj: TelBot = {
                telegram_name: info.first_name,
                name: bot.name,
                apiKey: bot.apiKey,
                ownerId,
                messages: [],
                profile,
                description: '',
                bot_id: info.id,
                comands
            }


            return obj
        } catch (err) {
            console.log(err)
            throw new HttpException(err.message || "internal error in obtain botinfo", err.status || 501)
        }


    }
}