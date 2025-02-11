import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebScraperService } from './web-scraper.service';
import { WebScraperController } from './web-scraper.controller';
import { ContactInfo } from '../database/entities/contact-info.entity';
import { DatabaseModule } from '../database/database.module';
import { TelemetryModule } from '../telemetry/telemetry.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([ContactInfo]),
    TelemetryModule,
  ],
  controllers: [WebScraperController],
  providers: [WebScraperService],
  exports: [WebScraperService], // ✅ Export service for potential reuse
})
export class WebScraperModule {}
