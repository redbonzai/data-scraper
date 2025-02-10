import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebScraperService } from './web-scraper.service';
import { WebScraperController } from './web-scraper.controller';
import { ContactInfo } from '../database/entities/contact-info.entity';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule, // ✅ Import DatabaseModule to access ContactInfo repository
    TypeOrmModule.forFeature([ContactInfo]), // ✅ Explicitly register ContactInfo
  ],
  controllers: [WebScraperController],
  providers: [WebScraperService],
  exports: [WebScraperService], // ✅ Export service for potential reuse
})
export class WebScraperModule {}
