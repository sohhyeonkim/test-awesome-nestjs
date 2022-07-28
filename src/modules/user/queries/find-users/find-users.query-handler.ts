import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import type { Result } from 'oxide.ts/dist';
import { Ok } from 'oxide.ts/dist';

import { QueryHandlerBase } from '../../../../libs/ddd/domain/base-classes/query-handler.base';
import { UserRepository } from '../../database/user.repository';
import { IUserRepositoryPort } from '../../database/user.repository.port';
import type { UserEntity } from '../../domain/entities/user.entity';
import { FindUsersQuery } from './find-users.query';

@QueryHandler(FindUsersQuery)
export class FindUsersQueryHandler extends QueryHandlerBase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepo: IUserRepositoryPort,
  ) {
    super();
  }

  async handle(query: FindUsersQuery): Promise<Result<UserEntity[], Error>> {
    const users = await this.userRepo.findUsers(query);

    return Ok(users);
  }
}
