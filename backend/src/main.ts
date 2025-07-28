import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
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
