import { Controller, Post, Body } from '@nestjs/common';
import { BingSearchService } from './bing-search.service';
import { GoogleSearchService } from './google-search.service';
import { WebScraperService } from '../web-scraper/web-scraper.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly bingSearchService: BingSearchService,
    private readonly googleSearchService: GoogleSearchService,
    private readonly scraperService: WebScraperService,
  ) {}

  /**
   * Searches the internet using either Google or Bing, then scrapes the results.
   * @param data The search query and the search engine choice.
   * @returns A response after searching and scraping.
   */
  @Post()
  async searchAndScrape(
    @Body() data: { query: string; engine: 'google' | 'bing' },
  ) {
    let urls: string[] = [];

    if (data.engine === 'google') {
      urls = await this.googleSearchService.searchWeb(data.query);
    } else {
      urls = await this.bingSearchService.searchWeb(data.query);
    }

    if (urls.length === 0) {
      return { message: `No URLs found for query: "${data.query}"` };
    }

    return this.scraperService.scrapeWebsites(urls);
  }
}
