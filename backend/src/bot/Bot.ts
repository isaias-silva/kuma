import * as TelegramBot from "node-telegram-bot-api";

export class Bot {
    socket: TelegramBot
    apiKey: string


    constructor(apiKey: string) {
        this.apiKey = apiKey
    }


    start = async () => {
        
        try {
            console.log('bot start')   
                this.socket = new TelegramBot(this.apiKey,{polling:true})
            this.socket.on('message',async(msg)=>{
                console.log(msg)
            })
         
        } catch (err) {
            console.log('error: ' + err)
        }
    }
}