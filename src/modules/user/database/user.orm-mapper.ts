import { UUID } from '../../../libs/ddd/domain/value-objects/uuid.value-object';
import type {
  IEntityProps,
  OrmEntityProps,
} from '../../../libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import { OrmMapper } from '../../../libs/ddd/infrastructure/database/base-classes/orm-mapper.base';
import type { IUserProps, UserEntity } from '../domain/entities/user.entity';
import { Address } from '../domain/value-objects/address.value-object';
import { Email } from '../domain/value-objects/email.value-object';
import type { UserOrmEntity } from './user.orm-entity';

export class UserOrmMapper extends OrmMapper<UserEntity, UserOrmEntity> {
  protected toOrmProps(entity: UserEntity): OrmEntityProps<UserOrmEntity> {
    const props = entity.getPropsCopy();

    const ormProps: OrmEntityProps<UserOrmEntity> = {
      email: props.email.value,
      country: props.address.country,
      postalCode: props.address.postalCode,
      street: props.address.street,
      role: props.role,
    };

    return ormProps;
  }

  protected toDomainProps(ormEntity: UserOrmEntity): IEntityProps<IUserProps> {
    const id = new UUID(ormEntity.id);
    const props: IUserProps = {
      email: new Email(ormEntity.email),
      role: ormEntity.role,
      address: new Address({
        street: ormEntity.street,
        postalCode: ormEntity.postalCode,
        country: ormEntity.country,
      }),
    };

    return { id, props };
  }
}
