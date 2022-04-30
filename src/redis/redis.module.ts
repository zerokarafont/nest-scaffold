import { Module, DynamicModule, Global, Provider } from '@nestjs/common';
import Redis from 'ioredis';
import {
  IRedisOptions,
  IRedisAsyncOptions,
  IRedisOptionsFactory,
} from './interfaces/redis-options.interface';
import { PK_REDIS_OPTIONS, PK_REDIS } from './redis.constants';

@Global()
@Module({})
export class RedisModule {
  static register(options: IRedisOptions): DynamicModule {
    const redisOptions = {
      provide: PK_REDIS_OPTIONS,
      useValue: options,
    };
    const redisProvider = {
      provide: PK_REDIS,
      useFactory: () => {
        const { host, port } = options;
        return new Redis({
          host,
          port,
        });
      },
    };
    return {
      module: RedisModule,
      imports: [],
      providers: [redisOptions, redisProvider],
      exports: [redisOptions, redisProvider],
    };
  }

  static registerAsync(options: IRedisAsyncOptions): DynamicModule {
    const providers = this.createAsyncProviders(options);
    return {
      module: RedisModule,
      imports: options.imports,
      providers,
      exports: providers,
    };
  }

  private static createAsyncProviders(options: IRedisAsyncOptions): Provider[] {
    const redisProvider = {
      provide: PK_REDIS,
      useFactory: (options: IRedisOptions) => {
        const { host, port } = options;
        return new Redis({
          host,
          port,
        });
      },
      inject: [PK_REDIS_OPTIONS],
    };
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options), redisProvider];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
      redisProvider,
    ];
  }

  private static createAsyncOptionsProvider(
    options: IRedisAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PK_REDIS_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // options.useExisting
    return {
      provide: PK_REDIS_OPTIONS,
      useFactory: async (optionsFactory: IRedisOptionsFactory) =>
        await optionsFactory.createRedisOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
