import { Args, Query, Resolver } from '@nestjs/graphql';

import { UserRepository } from '../../database/user.repository';
import { UserResponse } from '../../dtos/user.response.dto';
import { FindUsersQuery } from './find-users.query';
import { FindUsersRequest } from './find-users.request.dto';

@Resolver()
export class FindUsersGraphqlResolver {
  constructor(private readonly userRepo: UserRepository) {}

  @Query(() => [UserResponse])
  async findUsers(
    @Args('input') input: FindUsersRequest,
  ): Promise<UserResponse[]> {
    const query = new FindUsersQuery(input);
    const users = await this.userRepo.findUsers(query);

    return users.map((user) => new UserResponse(user));
  }
}
