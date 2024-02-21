import { MiddlewareConsumer, Module, } from '@nestjs/common';

import { UserModule } from './routes/user/user.module';

import { MongooseConfigModule } from './mongoose.module';
import { AuthModule } from './routes/auth/auth.module';
import { JwtMiddleware } from './middlewares/check.jwt';
import { AdmMiddleware } from './middlewares/check.adm';
import { MulterModule } from '@nestjs/platform-express';
import { UploadModule } from './routes/upload/upload.module';
import { BotModule } from './routes/bot/bot.module';
import { WsModule } from './routes/websocket/websocket.module';


@Module({
  imports: [MongooseConfigModule,
    UserModule,
    AuthModule,
    UploadModule,
    BotModule,
    WsModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes('user/*', 'upload/*','bot/*')
      .apply(AdmMiddleware).forRoutes('user/create', 'user/delete', 'user/promote', 'user/all', 'user/renovatePlan')
  }
}
