import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateUserCliController } from './commands/create-user/create-user.cli.controller';
import { CreateUserGraphqlResolver } from './commands/create-user/create-user.graphql-resolver';
import { CreateUserHttpController } from './commands/create-user/create-user.http.controller';
import { CreateUserMessageController } from './commands/create-user/create-user.message.controller';
import { CreateUserService } from './commands/create-user/create-user.service';
import { DeleteUserHttpController } from './commands/delete-user/delete-user.http-controller';
import { DeleteUserService } from './commands/delete-user/delete-user.service';
import { UserOrmEntity } from './database/user.orm-entity';
import { UserRepository } from './database/user.repository';
import { FindUsersGraphqlResolver } from './queries/find-users/find-users.graphql-resolver';
import { FindUsersHttpController } from './queries/find-users/find-users.http.controller';
import { FindUsersQueryHandler } from './queries/find-users/find-users.query-handler';
import { createUserCliLoggerProvider } from './user.providers';

const httpControllers = [
  CreateUserHttpController,
  DeleteUserHttpController,
  FindUsersHttpController,
];

const messageControllers = [CreateUserMessageController];

const cliControllers = [CreateUserCliController];

const graphqlResolvers = [CreateUserGraphqlResolver, FindUsersGraphqlResolver];

const repositories = [UserRepository];

const commandHandlers = [CreateUserService, DeleteUserService];

const queryHandlers = [FindUsersQueryHandler];

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity]), CqrsModule],
  controllers: [...httpControllers, ...messageControllers],
  providers: [
    ...cliControllers,
    ...repositories,
    ...graphqlResolvers,
    ...commandHandlers,
    ...queryHandlers,
    createUserCliLoggerProvider,
  ],
})
export class UserModule {}
