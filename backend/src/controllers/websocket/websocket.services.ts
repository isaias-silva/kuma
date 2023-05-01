import { Injectable } from '@nestjs/common';
import { WsGateway } from './websocket.gateway';

@Injectable()
export class WsService {
  constructor(private readonly appGateway: WsGateway) {}

  sendMessage(): void {
    this.appGateway.server.emit('message', 'Hello world!');
  }
}