import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { join } from 'path';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const normalizeOrigin = (val?: string) => (val || '').trim().replace(/\/$/, '');
  const envOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);
  const devFallbackOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'];
  const allowedOrigins = Array.from(new Set([...envOrigins.filter(origin => origin !== '*'), ...devFallbackOrigins]));

  const allowAnyOrigin = envOrigins.includes('*') || process.env.ALLOW_ANY_ORIGIN === 'true' || allowedOrigins.length === 0;
  const isLocalOrigin = (origin: string) => /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);
  const isPrivateNetworkOrigin = (origin: string) =>
    /^https?:\/\/((10\.\d{1,3}\.\d{1,3}\.\d{1,3})|(192\.168\.\d{1,3}\.\d{1,3})|(172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}))(:(\d+))?$/.test(origin);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl), private-network dev origins, or any explicitly whitelisted origin.
      if (allowAnyOrigin || !origin) return callback(null, true);
      const normalized = normalizeOrigin(origin);
      if (isLocalOrigin(normalized) || isPrivateNetworkOrigin(normalized) || allowedOrigins.includes(normalized)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
    optionsSuccessStatus: 204
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  const seedService = app.get(SeedService);
  await seedService.seedAdmin();
  await app.listen(3001);
}
bootstrap();
