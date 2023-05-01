import { Module } from '@nestjs/common';
import { WsGateway } from './websocket.gateway';
import { WsService } from './websocket.services';

@Module({
  providers: [WsGateway, WsService],
  exports: [WsService]

})
export class WsModule { }