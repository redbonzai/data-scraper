import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TelemetryService } from '../telemetry/telemetry.service';

@Module({
  imports: [],
  controllers: [SearchController],
  providers: [SearchService, TelemetryService],
  exports: [SearchService],
})
export class SearchModule {}
