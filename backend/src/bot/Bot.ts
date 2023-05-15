import * as TelegramBot from "node-telegram-bot-api";
import { Socket } from "socket.io";
import extract from "./messageExtract";

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


                const [existMessage] = this.messages.filter(value => value.id == formatMessage.id)
                if (existMessage) {
                    console.log('message exist')
                    const indexExistMessage = this.messages.indexOf(existMessage)
                    this.messages[indexExistMessage].messages.push(existMessage.messages[0])
                } else {
                    this.messages.push(formatMessage)

                }
                console.log(this.messages)
                this.websocket.emit("telegram_message", this.messages)

            })

        } catch (err) {
            console.log('error: ' + err)
        }
    }
    kill = async () => {
        await this.socket.stopPolling()
        await this.socket.close()
    }
}