import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './domains/database/database.module';
import { WebScraperModule } from './domains/web-scraper/web-scraper.module';

@Module({
  imports: [DatabaseModule, WebScraperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
