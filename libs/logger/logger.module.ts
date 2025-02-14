import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LogFilterTransport } from './transports/log-filter.transport';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PinoLoggerModule.forRootAsync({
      providers: undefined,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logLevel = configService.get<string>('LOG_LEVEL', 'info');

        return {
          pinoHttp: {
            level: logLevel,
            serializers: {
              req: (req) => ({
                method: req.method,
                url: req.url,
              }),
              res: (res) => ({
                statusCode: res.statusCode,
                responseTime: res.responseTime,
              }),
              err: (err) => ({
                type: err.type,
                message: err.message,
                stack: err.stack,
                code: err.code,
                signal: err.signal,
              }),
            },
            stream: new LogFilterTransport(),
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
