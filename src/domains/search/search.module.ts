import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { TelemetryService } from '../telemetry/telemetry.service';
import { WebScraperService } from '../web-scraper/web-scraper.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactInfo } from '../database/entities/contact-info.entity';
import { BingSearchService } from './bing-search.service';
import { GoogleSearchService } from './google-search.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContactInfo])],
  controllers: [SearchController],
  providers: [
    BingSearchService,
    GoogleSearchService,
    WebScraperService,
    TelemetryService,
  ],
  exports: [BingSearchService, GoogleSearchService],
})
export class SearchModule {}
