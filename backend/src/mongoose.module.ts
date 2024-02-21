import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';

config()

@Module({
  imports: [MongooseModule.forRoot(process.env.DB_HOST || 'mongodb://localhost:27017/db')],
})
export class MongooseConfigModule { }