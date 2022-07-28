import type { Provider } from '@nestjs/common';
import { Logger } from '@nestjs/common';

/* Constructing custom providers
 */
export const createUserCliLoggerSymbol = Symbol('createUserCliLoggerSymbol');

export const createUserCliLoggerProvider: Provider = {
  provide: createUserCliLoggerSymbol,
  useFactory: (): Logger => new Logger('create-user-cli'),
};
