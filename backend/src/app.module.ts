import { Module } from '@nestjs/common';
import { UserController } from './controllers/user/user.controller';
import { UserModule } from './controllers/user/user.module';
import { UserServices } from './controllers/user/user.services';
import { MongooseConfigModule } from './mongoose.module';



@Module({
  imports: [MongooseConfigModule,UserModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
