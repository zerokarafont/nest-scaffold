import { Module, DynamicModule, Global, Provider } from '@nestjs/common';
import {
  IMoralisAsyncOptions,
  IMoralisOptions,
  IMoralisOptionsFactory,
} from './interfaces';
import { MoralisService } from './moralis.service';
import { PK_MORALIS_OPTIONS } from './moralis.constants';

@Global()
@Module({})
export class MoralisModule {
  static register(options: IMoralisOptions): DynamicModule {
    return {
      module: MoralisModule,
      imports: [],
      providers: [
        {
          provide: PK_MORALIS_OPTIONS,
          useValue: options,
        },
        MoralisService,
      ],
      exports: [MoralisService],
    };
  }

  static registerAsync(options: IMoralisAsyncOptions): DynamicModule {
    const providers = this.createAsyncProviders(options);
    return {
      module: MoralisModule,
      imports: options.imports,
      providers,
      exports: providers,
    };
  }

  private static createAsyncProviders(
    options: IMoralisAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options), MoralisService];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
      MoralisService,
    ];
  }

  private static createAsyncOptionsProvider(
    options: IMoralisAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PK_MORALIS_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // options.useExisting
    return {
      provide: PK_MORALIS_OPTIONS,
      useFactory: async (optionsFactory: IMoralisOptionsFactory) =>
        await optionsFactory.createMoralisOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
