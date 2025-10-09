import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from '../validators/env.validator';

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  get<K extends keyof EnvVariables>(key: K): EnvVariables[K] {
    return this.configService.get(key);
  }
}
