import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './domains/database/database.module';
import { WebScraperModule } from './domains/web-scraper/web-scraper.module';
import { TelemetryModule } from './domains/telemetry/telemetry.module';

@Module({
  imports: [DatabaseModule, WebScraperModule, TelemetryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
