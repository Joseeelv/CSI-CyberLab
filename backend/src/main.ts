// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Parse cookies on incoming requests so controllers can read req.cookies
  app.use(cookieParser());

  // Prefijo global (opcional pero recomendado)
  app.setGlobalPrefix('api');

  // Habilitar CORS para tu frontend. Usa FRONTEND_URL de .env si está disponible.
  const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:3001';
  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend iniciado en http://localhost:${port}`);
}
bootstrap();