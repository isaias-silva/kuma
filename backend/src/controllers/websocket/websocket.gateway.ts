import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    MessageBody,
    ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Bot } from 'src/bot/Bot';
import { WsService } from './websocket.services';

@WebSocketGateway({ cors: true })

export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private bots: Bot[] = []
    @WebSocketServer() server: Server;

    afterInit(server: Socket) {

        console.log('socket starting...')
    }
    handleDisconnect(client: Socket) {
        console.log(`socket disconnect [${client.id}]...`)
        const [botRemove] = this.bots.filter((value) => value.websocket.id == client.id)
        if(botRemove){
            console.log(`bot ${botRemove.websocket.id} removed`)
            this.bots.slice(this.bots.indexOf(botRemove),1)
        }
    }
    handleConnection(client: Socket, ...args: any[]) {
        console.log(`socket connect [${client.id}]...`)

        client.on('bot_start', async (data: { apiKey: string }) => {
                if (!data.apiKey) {
                    console.log('bot not exists')
                   client.emit('error','bot not exists')
                    return
            }
            const [existsBot] = this.bots.filter((value) => value.apiKey == data.apiKey)
            if (existsBot) {
                console.log('change bot socket')
                existsBot.websocket = client
                //a
            } else {
                console.log('create a new bot')
                const botInstance = new Bot(data.apiKey, client)
               await botInstance.start()
                this.bots.push(botInstance)
            }
        })

    }


}