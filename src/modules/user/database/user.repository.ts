import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotFoundException } from '../../../exceptions';
import type { QueryParams } from '../../../libs/ddd/domain/ports/repository.ports';
import type { WhereCondition } from '../../../libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { TypeormRepositoryBase } from '../../../libs/ddd/infrastructure/database/base-classes/typeorm.repository.base';
import { removeUndefinedProps } from '../../../libs/utils/remove-undefined-props.util';
import type { IUserProps } from '../domain/entities/user.entity';
import { UserEntity } from '../domain/entities/user.entity';
import type { FindUsersQuery } from '../queries/find-users/find-users.query';
import { UserOrmEntity } from './user.orm-entity';
import { UserOrmMapper } from './user.orm-mapper';
import type { IUserRepositoryPort } from './user.repository.port';

@Injectable()
export class UserRepository
  extends TypeormRepositoryBase<UserEntity, IUserProps, UserOrmEntity>
  implements IUserRepositoryPort
{
  protected relations: string[] = [];

  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {
    super(
      userRepository,
      new UserOrmMapper(UserEntity, UserOrmEntity),
      new Logger('UserRepository'),
    );
  }

  private async findOneById(id: string): Promise<UserOrmEntity | undefined> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    return user;
  }

  async findOneByIdOrThrow(id: string): Promise<UserEntity> {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }

    return this.mapper.toDomainEntity(user);
  }

  private async findOneByEmail(
    email: string,
  ): Promise<UserOrmEntity | undefined> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async findOneByEmailOrThrow(email: string): Promise<UserEntity> {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    return this.mapper.toDomainEntity(user);
  }

  async exists(email: string): Promise<boolean> {
    const found = await this.findOneByEmail(email);

    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (found) {
      return true;
    }

    return false;
  }

  async findUsers(query: FindUsersQuery): Promise<UserEntity[]> {
    const where: QueryParams<UserOrmEntity> = removeUndefinedProps(query);
    const users = await this.repository.find({ where });

    return users.map((user) => this.mapper.toDomainEntity(user));
  }

  // Used to construct a query
  protected prepareQuery(
    params: QueryParams<IUserProps>,
  ): WhereCondition<UserOrmEntity> {
    const where: QueryParams<UserOrmEntity> = {};

    if (params.id) {
      where.id = params.id.value;
    }

    if (params.createdAt) {
      where.createdAt = params.createdAt.value;
    }

    if (params.address?.country) {
      where.country = params.address.country;
    }

    if (params.address?.street) {
      where.street = params.address.street;
    }

    if (params.address?.postalCode) {
      where.postalCode = params.address.postalCode;
    }

    return where;
  }
}
