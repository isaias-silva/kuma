import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { UploadController } from "./upload.controller";

@Module({
    imports:[UserModule],
    providers: [],
    controllers: [UploadController],
  
    
  })
  export class UploadModule {}