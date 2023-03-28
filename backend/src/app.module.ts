import { MiddlewareConsumer, Module, } from '@nestjs/common';

import { UserModule } from './controllers/user/user.module';

import { MongooseConfigModule } from './mongoose.module';
import { AuthModule } from './controllers/auth/auth.module';
import { JwtMiddleware } from './middlewares/check.jwt';
import { AdmMiddleware } from './middlewares/check.adm';
import { MulterModule } from '@nestjs/platform-express';
import { UploadModule } from './controllers/upload/upload.module';


@Module({
  imports: [MongooseConfigModule,
     UserModule,
      AuthModule, 
      UploadModule,
      MulterModule.register({
    dest: './uploads',
  })],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes('user/*','upload/*')
      .apply(AdmMiddleware).forRoutes('user/create', 'user/delete', 'user/promote', 'user/all', 'user/renovatePlan')
  }
}
