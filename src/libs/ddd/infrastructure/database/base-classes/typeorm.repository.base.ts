import type { FindConditions, ObjectLiteral, Repository } from 'typeorm';

import { NotFoundException } from '../../../../../exceptions';
import type { AggregateRoot } from '../../../domain/base-classes/aggregate-root.base';
import { DomainEvents } from '../../../domain/domain-events';
import type { ILogger } from '../../../domain/ports/logger.port';
import type {
  IDataWithPaginationMeta,
  IFindManyPaginatedParams,
  IRepositoryPort,
  QueryParams,
} from '../../../domain/ports/repository.ports';
import { ID } from '../../../domain/value-objects/id.value-object';
import type { OrmMapper } from './orm-mapper.base';

export type WhereCondition<OrmEntity> =
  | Array<FindConditions<OrmEntity>>
  | FindConditions<OrmEntity>
  | ObjectLiteral
  | string;

export abstract class TypeormRepositoryBase<
  Entity extends AggregateRoot<unknown>,
  EntityProps,
  OrmEntity,
> implements IRepositoryPort<Entity, EntityProps>
{
  protected constructor(
    protected readonly repository: Repository<OrmEntity>,
    protected readonly mapper: OrmMapper<Entity, OrmEntity>,
    protected readonly logger: ILogger,
  ) {}

  /**
   * Specify relations to other tables.
   * For example: `relations = ['user', ...]`
   */
  protected abstract relations: string[];

  protected tableName = this.repository.metadata.tableName;

  protected abstract prepareQuery(
    params: QueryParams<EntityProps>,
  ): WhereCondition<OrmEntity>;

  async save(entity: Entity): Promise<Entity> {
    entity.validate(); // Protecting invariant before saving
    const ormEntity = this.mapper.toOrmEntity(entity);
    const result = await this.repository.save(ormEntity);
    await DomainEvents.publishEvents(
      entity.id,
      this.logger,
      this.correlationId,
    );
    this.logger.debug(
      `[${entity.constructor.name}] persisted ${entity.id.value}`,
    );

    return this.mapper.toDomainEntity(result);
  }

  async saveMultiple(entities: Entity[]): Promise<Entity[]> {
    const ormEntities = entities.map((entity) => {
      entity.validate();

      return this.mapper.toOrmEntity(entity);
    });
    const result = await this.repository.save(ormEntities);
    await Promise.all(
      entities.map((entity) =>
        DomainEvents.publishEvents(entity.id, this.logger, this.correlationId),
      ),
    );
    this.logger.debug(
      `[${entities}]: persisted ${entities.map((entity) => entity.id)}`,
    );

    return result.map((entity) => this.mapper.toDomainEntity(entity));
  }

  async findOne(
    params: QueryParams<EntityProps> = {},
  ): Promise<Entity | undefined> {
    const where = this.prepareQuery(params);
    const found = await this.repository.findOne({
      where,
      relations: this.relations,
    });

    return found ? this.mapper.toDomainEntity(found) : undefined;
  }

  async findOneOrThrow(params: QueryParams<EntityProps> = {}): Promise<Entity> {
    const found = await this.findOne(params);

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  async findOneByIdOrThrow(id: ID | string): Promise<Entity> {
    const found = await this.repository.findOne({
      where: { id: id instanceof ID ? id.value : id },
    });

    if (!found) {
      throw new NotFoundException();
    }

    return this.mapper.toDomainEntity(found);
  }

  async findMany(params: QueryParams<EntityProps> = {}): Promise<Entity[]> {
    const result = await this.repository.find({
      where: this.prepareQuery(params),
      relations: this.relations,
    });

    return result.map((item) => this.mapper.toDomainEntity(item));
  }

  async findManyPaginated({
    params = {},
    pagination,
    orderBy,
  }: IFindManyPaginatedParams<EntityProps>): Promise<
    IDataWithPaginationMeta<Entity[]>
  > {
    const [data, count] = await this.repository.findAndCount({
      skip: pagination?.skip,
      take: pagination?.limit,
      where: this.prepareQuery(params),
      order: orderBy,
      relations: this.relations,
    });

    const result: IDataWithPaginationMeta<Entity[]> = {
      data: data.map((item) => this.mapper.toDomainEntity(item)),
      count,
      limit: pagination?.limit,
      page: pagination?.page,
    };

    return result;
  }

  async delete(entity: Entity): Promise<Entity> {
    entity.validate();
    await this.repository.remove(this.mapper.toOrmEntity(entity));
    await DomainEvents.publishEvents(
      entity.id,
      this.logger,
      this.correlationId,
    );
    this.logger.debug(
      `[${entity.constructor.name}] deleted ${entity.id.value}`,
    );

    return entity;
  }

  protected correlationId?: string;

  setCorrelationId(correlationId: string): this {
    this.correlationId = correlationId;
    this.setContext();

    return this;
  }

  private setContext() {
    if (this.correlationId) {
      this.logger.setContext(`${this.constructor.name}:${this.correlationId}`);
    } else {
      this.logger.setContext(this.constructor.name);
    }
  }
}
