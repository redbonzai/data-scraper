import { Controller, Post, Body } from '@nestjs/common';
import { WebScraperService } from '../web-scraper/web-scraper.service';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly scraperService: WebScraperService,
  ) {}

  /**
   * Searches the internet and scrapes found URLs.
   * @param data The search query input.
   * @returns A response after searching and scraping.
   */
  @Post()
  async searchAndScrape(@Body() data: { query: string }) {
    const urls = await this.searchService.searchWeb(data.query);
    if (urls.length === 0) {
      return { message: `No URLs found for query: "${data.query}"` };
    }

    return this.scraperService.scrapeWebsites(urls);
  }
}
