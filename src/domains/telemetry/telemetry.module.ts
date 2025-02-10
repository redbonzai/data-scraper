import { Module } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TelemetryService],
  exports: [TelemetryService],
})
export class TelemetryModule {}
