"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const seed_service_1 = require("./seed/seed.service");
const path_1 = require("path");
const express = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const normalizeOrigin = (val) => (val || '').trim().replace(/\/$/, '');
    const envOrigins = (process.env.FRONTEND_URL || '')
        .split(',')
        .map(normalizeOrigin)
        .filter(Boolean);
    const devFallbackOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'];
    const allowedOrigins = Array.from(new Set([...envOrigins.filter(origin => origin !== '*'), ...devFallbackOrigins]));
    const allowAnyOrigin = envOrigins.includes('*') || process.env.ALLOW_ANY_ORIGIN === 'true' || allowedOrigins.length === 0;
    const isLocalOrigin = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);
    const isPrivateNetworkOrigin = (origin) => /^https?:\/\/((10\.\d{1,3}\.\d{1,3}\.\d{1,3})|(192\.168\.\d{1,3}\.\d{1,3})|(172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}))(:(\d+))?$/.test(origin);
    app.enableCors({
        origin: (origin, callback) => {
            if (allowAnyOrigin || !origin)
                return callback(null, true);
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
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    app.use('/uploads', express.static((0, path_1.join)(process.cwd(), 'uploads')));
    const seedService = app.get(seed_service_1.SeedService);
    await seedService.seedAdmin();
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map