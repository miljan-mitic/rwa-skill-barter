import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigurationService } from './modules/configuration/services/configuration.service';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configurationService = app.get(ConfigurationService);

  const CLIENT_APP_URL = configurationService.get('CLIENT_APP_URL');
  app.enableCors({
    origin: [CLIENT_APP_URL],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { excludeExtraneousValues: true },
    }),
  );

  const PORT = configurationService.get('PORT') || 3000;
  await app.listen(PORT);
  Logger.log(`Listening on port: ${PORT}`, 'NestApplication');
}
bootstrap();
