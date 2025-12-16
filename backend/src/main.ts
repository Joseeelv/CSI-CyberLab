import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug', 'verbose'] });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Parse cookies on incoming requests so controllers can read req.cookies
  app.use(cookieParser());

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Prefijo global (opcional pero recomendado)
  app.setGlobalPrefix('api');

  // Habilitar CORS para tu frontend. Usa FRONTEND_URL de .env si está disponible.
  const allowedOrigins = [
    'http://localhost',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend iniciado en http://0.0.0.0:${port}`);
}
bootstrap();