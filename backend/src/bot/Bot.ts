import * as TelegramBot from "node-telegram-bot-api";
import { Socket } from "socket.io";

type MessagesTel = {
    name: string,
    messages: string[]
    profile: string,
    id: number
}

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
                console.log(msg)
                const { text, chat } = msg
                const dataprofile = (await this.socket.getUserProfilePhotos(chat.id))?.photos[0]
                const profile = await this.socket.getFileLink(dataprofile[0].file_id)
                const formatMessage = {
                    name: chat.username,
                    id: chat.id,
                    messages: [text],
                    profile

                }
                console.log(formatMessage)

                const [existMessage] = this.messages.filter(value => value.id == formatMessage.id)
                if (existMessage) {
                    const indexExistMessage = this.messages.indexOf(existMessage)
                    this.messages[indexExistMessage].messages.push(text)
                } else {
                    this.messages.push(formatMessage)

                }

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