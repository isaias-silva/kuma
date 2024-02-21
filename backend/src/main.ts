
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv'
import { ValidationPipe } from '@nestjs/common';


async function initServer() {
  config()
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe())
 
  await app.listen(process.env.PORT || 8080);

}
initServer();
