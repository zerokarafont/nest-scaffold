import type { ModuleMetadata, Type } from '@nestjs/common';

export interface IRedisOptions {
  host: string;
  port: number;
}

export interface IRedisOptionsFactory {
  createRedisOptions(): Promise<IRedisOptions> | IRedisOptions;
}

export interface IRedisAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<IRedisOptionsFactory>;
  useClass?: Type<IRedisOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<IRedisOptions> | IRedisOptions;
  inject?: any[];
}
