import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices/enums';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.USER_SERVICE_HOST,
      port: process.env.USER_SERVICE_PORT,
    },
  });
  await app.listen();
}
bootstrap();
