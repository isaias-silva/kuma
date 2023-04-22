import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';

config()

@Module({
    imports: [MongooseModule.forRoot(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@data.djsnl.mongodb.net/?retryWrites=true&w=majority`)],
  })
  export class MongooseConfigModule {}