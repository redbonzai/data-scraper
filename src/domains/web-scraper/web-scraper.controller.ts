import { Controller, Post, Body } from '@nestjs/common';
import { WebScraperService } from './web-scraper.service';

@Controller('scrape')
export class WebScraperController {
  constructor(private readonly scraperService: WebScraperService) {}

  @Post()
  async scrape(@Body() data: { urls: string[] }) {
    return this.scraperService.scrapeWebsites(data.urls);
  }
}
