import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as requestIp from 'request-ip';
import { SERVER_PORT } from './config/constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  // Configuración del middleware de request-ip
  app.use(requestIp.mw());

  // Obtener el puerto de la variable de entorno proporcionada por Heroku
  const port = process.env.PORT || 3000; // Usar 3000 si la variable de entorno no está definida

  // Server Port loacalmente
  //const port = +configService.get<number>(SERVER_PORT) || 3000;
  await app.listen(port);
}
bootstrap();
