import { DynamicModule, Global, Module } from '@nestjs/common';
import { IConfigOptions } from './config.interface';
import { ConfigService } from './config.service';

@Global()
@Module({})
export class ConfigModule {
  static register(options?: IConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
