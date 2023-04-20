import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { UploadController } from "./upload.controller";
import { BotModule } from "../bot/bot.module";

@Module({
    imports:[UserModule,BotModule],
    providers: [],
    controllers: [UploadController],
  
    
  })
  export class UploadModule {}