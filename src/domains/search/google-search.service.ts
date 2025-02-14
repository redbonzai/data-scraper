import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import {
  GoogleSearchResponse,
  GoogleSearchItem,
} from './interfaces/google.interface';

@Injectable()
export class GoogleSearchService {
  private readonly GOOGLE_API_KEY: string;
  private readonly GOOGLE_SEARCH_ENGINE_ID: string;
  private readonly GOOGLE_SEARCH_URL =
    'https://www.googleapis.com/customsearch/v1';
  private readonly logger = new Logger(GoogleSearchService.name);

  constructor(private readonly configService: ConfigService) {
    this.GOOGLE_API_KEY = this.configService.get<string>(
      'GOOGLE_API_KEY',
    ) as string;
    this.GOOGLE_SEARCH_ENGINE_ID = this.configService.get<string>(
      'GOOGLE_SEARCH_ENGINE_ID',
    ) as string;
  }

  /**
   * Searches Google using Custom Search API.
   * @param query The search term.
   * @returns A list of URLs.
   */
  async searchWeb(query: string): Promise<string[]> {
    try {
      const response = await axios.get<GoogleSearchResponse>(
        this.GOOGLE_SEARCH_URL,
        {
          params: {
            key: this.GOOGLE_API_KEY,
            cx: this.GOOGLE_SEARCH_ENGINE_ID,
            q: query,
            num: 10, // Fetch up to 10 results
          },
        },
      );

      // ✅ Use strict typing for items and avoid 'any' usage
      const items: GoogleSearchItem[] = response.data.items ?? [];
      const urls: string[] = items.map((item) => item.link);

      if (urls.length === 0) {
        this.logger.warn(`No results found for: "${query}"`);
      } else {
        this.logger.log(`🔍 Found ${urls.length} URLs for query: "${query}"`);
      }

      return urls;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`❌ Error searching Google: ${error.message}`);
      return [];
    }
  }
}
