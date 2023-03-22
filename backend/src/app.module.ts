import { MiddlewareConsumer, Module } from '@nestjs/common';

import { UserModule } from './controllers/user/user.module';

import { MongooseConfigModule } from './mongoose.module';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './middlewares/check.jwt';
import { AdmMiddleware } from './middlewares/check.adm';





@Module({
  imports: [MongooseConfigModule,UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { 
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes('user/*')
      .apply(AdmMiddleware).forRoutes('user/create','user/delete','user/promote','user/all')
  }
}
