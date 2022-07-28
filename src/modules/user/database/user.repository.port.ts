import type { IRepositoryPort } from '../../../libs/ddd/domain/ports/repository.ports';
import type { IUserProps, UserEntity } from '../domain/entities/user.entity';

interface IFindUsersParams {
  readonly country?: string;
  readonly postalCode?: string;
  readonly street?: string;
}

/* Repository port belongs to application's core / domain, but since it usually
 changes together with repository it is kept in the same directory for
 convenience. */
export interface IUserRepositoryPort
  extends IRepositoryPort<UserEntity, IUserProps> {
  findOneByIdOrThrow(id: string): Promise<UserEntity>;
  findOneByEmailOrThrow(email: string): Promise<UserEntity>;
  findUsers(query: IFindUsersParams): Promise<UserEntity[]>;
  exists(email: string): Promise<boolean>;
}
