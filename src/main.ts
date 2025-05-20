import 'newrelic';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger as PinoLogger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3050);

  const logger = app.get(PinoLogger);
  app.useLogger(logger);

  await app.listen(port ?? 3000);
  logger.log(`Data Scraper is running on port: ${port}`, 'MAIN.ts');
}
bootstrap();

