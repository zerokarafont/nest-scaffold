import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { IMoralisOptions } from './interfaces';
import { PK_MORALIS_OPTIONS } from './moralis.constants';
import Moralis from 'moralis';

@Injectable()
export class MoralisService {
  private Core: typeof Moralis.Core;
  private Auth: typeof Moralis.Auth;
  private EvmAPi: typeof Moralis.EvmApi;
  private SolApi: typeof Moralis.SolApi;

  constructor(@Inject(PK_MORALIS_OPTIONS) options: IMoralisOptions) {
    this.initialize(options);
  }

  private async initialize(options: IMoralisOptions) {
    try {
      await Moralis.start({ apiKey: options.apiKey, logLevel: 'verbose' });
      this.Core = Moralis.Core;
      this.Auth = Moralis.Auth;
      this.EvmAPi = Moralis.EvmApi;
      this.SolApi = Moralis.SolApi;
      Logger.log('initialize Moralis service successfully');
    } catch (err) {
      throw new ServiceUnavailableException(err.details || err.name || err);
    }
  }
}
