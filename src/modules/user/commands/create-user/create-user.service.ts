import { CommandHandler } from '@nestjs/cqrs';
import type { Result } from 'oxide.ts/dist';
import { Err, Ok } from 'oxide.ts/dist';

import { UnitOfWork } from '../../../../infrastructure/database/unit-of-work/unit-of-work';
import { CommandHandlerBase } from '../../../../libs/ddd/domain/base-classes/command-handler.base';
import type { ID } from '../../../../libs/ddd/domain/value-objects/id.value-object';
import type { IUserRepositoryPort } from '../../database/user.repository.port';
import { UserEntity } from '../../domain/entities/user.entity';
import { Address } from '../../domain/value-objects/address.value-object';
import { Email } from '../../domain/value-objects/email.value-object';
import { UserAlreadyExistsError } from '../../errors/user.errors';
import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserService extends CommandHandlerBase {
  constructor(protected readonly unitOfWork: UnitOfWork) {
    super(unitOfWork);
  }

  async handle(
    command: CreateUserCommand,
  ): Promise<Result<ID, UserAlreadyExistsError>> {
    /* Use a repository provided by UnitOfWork to include everything
       (including changes caused by Domain Events) into one
       atomic database transaction */
    const userRepo: IUserRepositoryPort = this.unitOfWork.getUserRepository(
      command.correlationId,
    );

    // user uniqueness guard
    if (await userRepo.exists(command.email)) {
      /** Returning an Error instead of throwing it
       *  so a controller can handle it explicitly */
      return Err(new UserAlreadyExistsError());
    }

    const user = UserEntity.create({
      email: new Email(command.email),
      address: new Address({
        country: command.country,
        postalCode: command.postalCode,
        street: command.street,
      }),
    });

    user.someBusinessLogic();

    const created = await userRepo.save(user);

    return Ok(created.id);
  }
}
