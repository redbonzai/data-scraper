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
        '--disable-http2',
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

    // Set a custom User-Agent to avoid potential blocking
    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';
    await page.setUserAgent(userAgent);

    for (const url of urls) {
      try {
        console.log(`Scraping: ${url}`);
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });

        const content = await page.content();
        const $ = cheerio.load(content);

        const phone =
          $('a[href^="tel:"]').first().text().replace(/\D+/g, '').trim() || '';
        const email =
          $('a[href^="mailto:"]')
            .map((_, el) => $(el).attr('href')?.replace('mailto:', '').trim())
            .get()
            .join(', ') || '';
        const address =
          $('address, div:contains("Address"), p:contains("Address")')
            .first()
            .text()
            .trim() || '';

        const contactInfo = this.contactInfoRepository.create({
          website: url,
          phone,
          email,
          address,
        });

        await this.contactInfoRepository.save(contactInfo);
        console.log(`✅ Saved contact info from ${url}`);
      } catch (error) {
        console.error(`❌ Error scraping ${url}:`, error);
      }
    }

    await page.close();
  }
}
