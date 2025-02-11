import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactInfo } from '../database/entities/contact-info.entity';
import { TelemetryService } from '../telemetry/telemetry.service';

@Injectable()
export class WebScraperService implements OnModuleInit, OnModuleDestroy {
  private browser: puppeteer.Browser;

  constructor(
    @InjectRepository(ContactInfo)
    private readonly contactInfoRepository: Repository<ContactInfo>,
    private readonly telemetryService: TelemetryService,
  ) {}

  async onModuleInit() {
    console.log('Starting Puppeteer...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-accelerated-2d-canvas',
      ],
      executablePath: '/usr/bin/chromium',
    });
  }

  async onModuleDestroy() {
    console.log('Closing Puppeteer...');
    if (this.browser) {
      await this.browser.close();
    }
  }

  async scrapeWebsites(urls: string[]) {
    const page = await this.browser.newPage();
    let successCount = 0;
    let failCount = 0;

    for (const url of urls) {
      try {
        console.log(`Scraping: ${url}`);
        const startTime = Date.now(); // ⏳ Start time

        await page.goto(url, { waitUntil: 'load', timeout: 60000 });

        const content = await page.content();
        const $ = cheerio.load(content);

        const phone = $('a[href^="tel:"]').text().trim() || '';
        const email = $('a[href^="mailto:"]').text().trim() || '';
        const address = $('address').text().trim() || '';

        const contactInfo = this.contactInfoRepository.create({
          website: url,
          phone,
          email,
          address,
        });

        await this.contactInfoRepository.save(contactInfo);
        console.log(`✅ Saved contact info from ${url}`);

        // 📊 Push success metric
        // await this.telemetryService.pushMetric('scrape_success', 1, {
        //   website: url,
        // });

        successCount++;

        // ⏳ Calculate and push processing time metric
        const duration = Date.now() - startTime;
        // await this.telemetryService.pushMetric('scrape_duration', duration, {
        //   website: url,
        // });
      } catch (error) {
        console.error(`❌ Error scraping ${url}:`, error);

        // 📊 Push failure metric
        // await this.telemetryService.pushMetric('scrape_failure', 1, {
        //   website: url,
        // });

        // failCount++;
      }
    }

    await page.close();

    // 📊 Push overall metrics
    // await this.telemetryService.pushMetric(
    //   'scrape_total_success',
    //   successCount,
    // );
    // await this.telemetryService.pushMetric('scrape_total_failure', failCount);
  }
}
