import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotServices } from './bot.services';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegramBotSchema } from './bot.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: 'Bot', schema: TelegramBotSchema,
        }]),
    ],/**imports */
    providers: [BotServices]/*services */,
    controllers: [BotController]/*controller */

})
export class BotModule {

}
