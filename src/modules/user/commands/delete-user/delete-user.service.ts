import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../../database/user.repository';
import { IUserRepositoryPort } from '../../database/user.repository.port';
import { DeleteUserCommand } from './delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepo: IUserRepositoryPort,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const found = await this.userRepo.findOneByIdOrThrow(command.userId);
    await this.userRepo.delete(found);
  }
}
