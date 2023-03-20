import { Module } from '@nestjs/common';
import { UserServices } from './user.services';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';

@Module({
  imports: [
    
    MongooseModule.forFeature([{
      name: 'User', schema: UserSchema,
    }]),
  ],
  providers: [UserServices],
  controllers: [UserController],
})
export class UserModule {
}