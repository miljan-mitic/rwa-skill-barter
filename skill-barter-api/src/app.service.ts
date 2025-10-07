import { Injectable } from '@nestjs/common';
import { version } from '../package.json';

@Injectable()
export class AppService {
  getAppVersion(): string {
    return `skill-barter-api v${version}`;
  }
}
