import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TelemetryService } from '../telemetry/telemetry.service';
import { WebScraperService } from '../web-scraper/web-scraper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactInfo } from '../database/entities/contact-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContactInfo])],
  controllers: [SearchController],
  providers: [SearchService, TelemetryService, WebScraperService],
  exports: [SearchService],
})
export class SearchModule {}
