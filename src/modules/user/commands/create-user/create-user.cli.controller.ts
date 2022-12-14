import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Command, Console } from 'nestjs-console';

import { ILogger } from '../../../../libs/ddd/domain/ports/logger.port';
import { createUserCliLoggerSymbol } from '../../user.providers';
import { CreateUserCommand } from './create-user.command';

// Allows creating a user using CLI (Command Line Interface)
@Console({
  command: 'new',
  description: 'A command to create a user',
})
export class CreateUserCliController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(createUserCliLoggerSymbol)
    private readonly logger: ILogger,
  ) {}

  @Command({
    command: 'user <email> <country> <postalCode> <street>',
    description: 'Create a user',
  })
  async createUser(
    email: string,
    country: string,
    postalCode: string,
    street: string,
  ): Promise<void> {
    const command = new CreateUserCommand({
      email,
      country,
      postalCode,
      street,
    });

    const id = await this.commandBus.execute(command);

    this.logger.log('User created:', id.unwrap().value);
  }
}
