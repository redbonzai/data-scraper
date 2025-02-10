import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactInfo } from '../database/entities/contact-info.entity';

@Injectable()
export class WebScraperService implements OnModuleInit, OnModuleDestroy {
  private browser: puppeteer.Browser;

  constructor(
    @InjectRepository(ContactInfo)
    private readonly contactInfoRepository: Repository<ContactInfo>,
  ) {}

  async onModuleInit() {
    console.log('Starting Puppeteer...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: '/usr/bin/chromium', // ✅ Ensure this path is correct
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

    for (const url of urls) {
      try {
        console.log(`Scraping: ${url}`);
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
        console.log(`Saved contact info from ${url}`);
      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
      }
    }

    await page.close();
  }
}
