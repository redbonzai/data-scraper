import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as zlib from 'zlib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelemetryService {
  constructor(private readonly configService: ConfigService) {}
  private readonly OBSERVE_CUSTOMER =
    this.configService.get<string>('OBSERVE_CUSTOMER');
  private readonly OBSERVE_TOKEN =
    this.configService.get<string>('OBSERVE_TOKEN');
  private readonly DATSTREAM_NAME =
    process.env.OBSERVE_DATASTREAM || 'default-metrics';

  private readonly OBSERVE_URL = `https://${this.OBSERVE_CUSTOMER}.collect.observeinc.com/v1/http/${this.DATSTREAM_NAME}`;
  private readonly logger = new Logger(TelemetryService.name);

  /**
   * Pushes a metric to Observe Inc.
   * @param metricName - The name of the metric (e.g., `scrape_success`).
   * @param value - The value of the metric (e.g., 1 for a success event).
   * @param labels - Additional metadata (e.g., `{ website: "example.com" }`).
   */
  async pushMetric(
    metricName: string,
    value: number,
    labels: Record<string, string> = {},
  ) {
    try {
      const payload = {
        metric: metricName,
        value,
        labels,
        timestamp: new Date().toISOString(),
      };

      const headers = {
        Authorization: `Bearer ${this.OBSERVE_TOKEN}`,
        'Content-Type': 'application/json',
      };

      await axios.post(this.OBSERVE_URL, payload, { headers });

      this.logger.log(`📊 Metric Sent: ${metricName} = ${value}`);
    } catch (error: unknown) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        `❌ Error sending metric ${metricName}: ${error.message}`,
      );
    }
  }

  /**
   * Pushes metrics in a batch using gzip compression (optional).
   * @param metrics - An array of metric objects.
   */
  async pushMetricsBatch(
    metrics: {
      metric: string;
      value: number;
      labels?: Record<string, string>;
    }[],
  ) {
    try {
      const payload = JSON.stringify(metrics);
      const compressedPayload = zlib.gzipSync(payload);

      const headers = {
        Authorization: `Bearer ${this.OBSERVE_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip', // Enables compression
      };

      await axios.post(this.OBSERVE_URL, compressedPayload, { headers });

      this.logger.log(`📊 Batch Metrics Sent (${metrics.length} entries)`);
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      this.logger.error(`❌ Error sending batch metrics: ${error.message}`);
    }
  }
}
