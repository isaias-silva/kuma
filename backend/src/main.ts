const PORT = process.env.PORT || 8080
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function initServer() {

  const app = await NestFactory.create(AppModule);
  
  await app.listen(PORT);

}
initServer();
