import { ArgumentInvalidException } from '../../../../exceptions';
import type { IDomainPrimitive } from '../base-classes/value-object.base';
import { ValueObject } from '../base-classes/value-object.base';

export class DateVO extends ValueObject<Date> {
  constructor(value: Date | string | number) {
    const date = new Date(value);
    super({ value: date });
  }

  public get value(): Date {
    return this.props.value;
  }

  public static now(): DateVO {
    return new DateVO(Date.now());
  }

  protected validate({ value }: IDomainPrimitive<Date>): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new ArgumentInvalidException('Incorrect date');
    }
  }
}
