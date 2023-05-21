import * as TelegramBot from "node-telegram-bot-api";
import { Socket } from "socket.io";
import extract from "./messageExtract";
import { BotServices } from "src/controllers/bot/bot.services";

export class Bot {
    socket: TelegramBot
    apiKey: string
    websocket: Socket

    private messages: MessagesTel[] = []
    constructor(apiKey: string, websocket: Socket) {
        this.apiKey = apiKey
        this.websocket = websocket
    }


    start = async () => {

        try {

            this.socket = new TelegramBot(this.apiKey, { polling: true })
            this.socket.on('message', async (msg) => {

                const formatMessage = await extract(this.socket, msg)
                if (!formatMessage) {
                    return
                }
                const [existMessage] = this.messages.filter(value => value.id == formatMessage.id)
                if (existMessage) {

                    const indexExistMessage = this.messages.indexOf(existMessage)

                    this.messages[indexExistMessage].messages.push(formatMessage.messages[0])

                } else {
                    this.messages.push(formatMessage)

                }
                console.log(this.messages)
                await this.getMessages()

            })

        } catch (err) {
            return
        }
    }
    getMessages = async () => {
        if (!this.socket || !this.websocket) {
            return
        }
        this.websocket.emit("telegram_message", this.messages)
    }
    kill = async () => {
        console.log('killing bot')
        await this.socket.stopPolling()

        this.socket = null
    }
}