import { Injectable } from '@nestjs/common';

import { TypeormUnitOfWork } from '../../../libs/ddd/infrastructure/database/base-classes/typeorm-unit-of-work';
import { UserOrmEntity } from '../../../modules/user/database/user.orm-entity';
import { UserRepository } from '../../../modules/user/database/user.repository';

@Injectable()
export class UnitOfWork extends TypeormUnitOfWork {
  // Add new repositories below to use this generic UnitOfWork

  // Convert TypeOrm Repository to a Domain Repository
  getUserRepository(correlationId: string): UserRepository {
    return new UserRepository(
      this.getOrmRepository(UserOrmEntity, correlationId),
    ).setCorrelationId(correlationId);
  }
}
