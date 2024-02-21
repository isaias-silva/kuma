import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserServices } from 'src/routes/user/user.services';
import { UserModule } from 'src/routes/user/user.module';

@Module({
  imports:[UserModule],
  providers: [AuthService],
  controllers: [AuthController],

  
})
export class AuthModule {}
