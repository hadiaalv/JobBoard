import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
    setHeaders: (res, path) => {
      if (path.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
        if (path.includes('/resumes/')) {
          res.setHeader('Content-Disposition', 'attachment; filename="' + path.split('/').pop() + '"');
        } else {
          res.setHeader('Content-Disposition', 'inline; filename="' + path.split('/').pop() + '"');
        }
      } else if (path.match(/\.(jpg|jpeg|png|gif)$/)) {
        res.setHeader('Content-Type', `image/${path.split('.').pop()}`);
      }
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: 422,
    }),
  );

  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT') || process.env.PORT || 3002;
  await app.listen(port);

  console.log(`App running at: ${await app.getUrl()}`);
  console.log(`CORS for: ${frontendUrl}`);
  console.log(`Serving static files from: ${join(__dirname, '..', 'uploads')}`);
}

bootstrap();
