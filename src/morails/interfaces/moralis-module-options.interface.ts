import type { ModuleMetadata, Type } from '@nestjs/common';

export interface IMoralisOptions {
  apiKey: string;
}

export interface IMoralisOptionsFactory {
  createMoralisOptions(): Promise<IMoralisOptions> | IMoralisOptions;
}

export interface IMoralisAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<IMoralisOptionsFactory>;
  useClass?: Type<IMoralisOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<IMoralisOptions> | IMoralisOptions;
  inject?: any[];
}
