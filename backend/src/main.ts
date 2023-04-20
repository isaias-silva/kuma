
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv'


async function initServer() {
  config()
  const app = await NestFactory.create(AppModule, { cors: true });

  await app.listen(process.env.PORT || 8080);

}
initServer();
