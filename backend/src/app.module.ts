import { Module } from '@nestjs/common';

import { UserModule } from './controllers/user/user.module';

import { MongooseConfigModule } from './mongoose.module';
import { AuthModule } from './auth/auth.module';





@Module({
  imports: [MongooseConfigModule,UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
