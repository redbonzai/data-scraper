import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './domains/database/database.module';
import { WebScraperModule } from './domains/web-scraper/web-scraper.module';
import { TelemetryModule } from './domains/telemetry/telemetry.module';
import { SearchModule } from './domains/search/search.module';
import { LoggerModule as PinoLogger } from '../libs/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PinoLogger,
    DatabaseModule,
    WebScraperModule,
    TelemetryModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
