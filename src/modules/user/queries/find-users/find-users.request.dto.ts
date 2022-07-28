import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import type { IFindUsers } from '../../../../interface-adapters/interfaces/user/find-users.interface';

@ArgsType() // <- only if you are using GraphQL
@InputType()
export class FindUsersRequest implements IFindUsers {
  @ApiProperty({ example: 'France', description: 'Country of residence' })
  @MaxLength(50)
  @IsOptional()
  @IsString()
  @Matches(/^[ A-Za-z]*$/)
  @Field({ nullable: true }) // <- only if you are using GraphQL
  readonly country: string;

  @ApiProperty({ example: '28566', description: 'Postal code' })
  @IsOptional()
  @MaxLength(10)
  @IsAlphanumeric()
  @Field({ nullable: true }) // <- only if you are using GraphQL
  readonly postalCode: string;

  @ApiProperty({ example: 'Grande Rue', description: 'Street' })
  @IsOptional()
  @MaxLength(50)
  @Matches(/^[ A-Za-z]*$/)
  @Field({ nullable: true }) // <- only if you are using GraphQL
  readonly street: string;
}
