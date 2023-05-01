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

@WebSocketGateway({ cors: true })

export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    afterInit(server: Socket) {
        
        console.log('socket starting...')
    }
    handleDisconnect(client: Socket) {
        console.log(`socket disconnect [${client.id}]...`)
    }
    handleConnection(client: Socket, ...args: any[]) {
        console.log(`socket connect [${client.id}]...`)

        client.on('bot_start', (data:{apiKey:string}) => {
           console.log(data)
            if (!data.apiKey) {
                console.log('apikey not exists')
                return
            }
            new Bot(data.apiKey).start()
        })
    }

    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: any) {
        return 'Hello world';
    }
}