import type { Result } from 'oxide.ts/dist';

import type { IUnitOfWorkPort } from '../ports/unit-of-work.port';
import type { Command } from './command.base';

export abstract class CommandHandlerBase<
  CommandHandlerReturnType = unknown,
  CommandHandlerError extends Error = Error,
> {
  constructor(protected readonly unitOfWork: IUnitOfWorkPort) {}

  // Forces all command handlers to implement a handle method
  abstract handle(
    command: Command,
  ): Promise<Result<CommandHandlerReturnType, CommandHandlerError>>;

  /**
   * Execute a command as a UnitOfWork to include
   * everything in a single atomic database transaction
   */
  execute(
    command: Command,
  ): Promise<Result<CommandHandlerReturnType, CommandHandlerError>> {
    return this.unitOfWork.execute(command.correlationId, async () =>
      this.handle(command),
    );
  }
}
