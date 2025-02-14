import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { BingSearchResponse } from './interfaces/bing.interface';
import { TelemetryService } from '../telemetry/telemetry.service';

@Injectable()
export class BingSearchService {
  private readonly BING_API_KEY: string;
  private readonly BING_SEARCH_URL: string;
  private readonly logger = new Logger(BingSearchService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly telemetryService: TelemetryService, // ✅ Inject TelemetryService
  ) {
    this.BING_API_KEY = this.configService.get<string>(
      'BING_API_KEY',
    ) as string;
    this.BING_SEARCH_URL = this.configService.get<string>(
      'BING_SEARCH_URL',
    ) as string;
  }

  /**
   * Searches the internet for URLs based on a given search query.
   * @param query The search term (e.g., "senior living accommodations").
   * @returns A list of URLs from Bing Search results.
   */
  async searchWeb(query: string): Promise<string[]> {
    const startTime = Date.now(); // ⏳ Start timing
    try {
      const response = await axios.get<BingSearchResponse>(
        this.BING_SEARCH_URL,
        {
          headers: { 'Ocp-Apim-Subscription-Key': this.BING_API_KEY },
          params: { q: query, count: 10 },
        },
      );

      const urls = response.data.webPages?.value?.map((item) => item.url) ?? [];

      if (urls.length === 0) {
        this.logger.warn(`No results found for: "${query}"`);
        await this.telemetryService.pushMetric('search_failure', 1, { query });
      } else {
        this.logger.log(`🔍 Found ${urls.length} URLs for query: "${query}"`);
        await this.telemetryService.pushMetric('search_success', urls.length, {
          query,
        });
      }

      // ⏳ Push search duration metric
      const duration = Date.now() - startTime;
      await this.telemetryService.pushMetric('search_duration', duration, {
        query,
      });

      return urls;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`❌ Error searching web: ${error.message}`);

      // 📊 Push failure metric
      await this.telemetryService.pushMetric('search_failure', 1, { query });

      return [];
    }
  }
}
