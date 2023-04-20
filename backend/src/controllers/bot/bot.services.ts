import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { TelBot } from "./bot.schema";
import { Model } from "mongoose";
import axios from "axios";
import generateFormData from "src/utils/generateFormData";


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
    async updateBot(ownerId: string, updateInfo: TelBot) {
        try {

            if (updateInfo.telegram_name) {

                await axios.post(`https://api.telegram.org/bot${updateInfo.apiKey}/setMyProfileName`, {
                    name: updateInfo.telegram_name
                }).then(response => {
                    return response
                }).catch(error => {
                    return error.response
                });
            }
            if (updateInfo.name) {
                await this.botModel.updateOne({ ownerId, apiKey: updateInfo.apiKey }, { name: updateInfo.name })
            }

        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    async updateBotProfile(formData: FormData) {

        const responseUpdateProfile = await axios.post(`https://api.telegram.org/bot${formData.get("botToken")}/setMyProfile`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }).then((res) => {
            return res.data
        }).catch(err => { return err.response })
        if (responseUpdateProfile.status != 200) {
        
            throw new HttpException('Error in update profile of telegram Bot', responseUpdateProfile.status)
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
            return 0
        })
        const info: { id: string, first_name: string } | null = await axios.get(`https://api.telegram.org/bot${bot.apiKey}/getMe`)
            .then((res) => { return res.data.result }).catch((err) => {
                return null
            })
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
            messages: message_data,
            profile,
            bot_id: parseInt(info.id)
        }

        return obj
    }
}