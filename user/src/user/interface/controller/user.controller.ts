/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  ConflictException,
  Controller,
  NotAcceptableException,
  NotFoundException,
  Param,
  PreconditionFailedException,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../application/command/impl/create-user.command';
import { CreateUserRequest } from '../dto/create-user.request';
import { match, Result } from 'oxide.ts';
import {
  AccessDeniedError,
  UserAlreadyExistError,
  UserNotFoundError,
} from '../../domain/error/user.error';
import { GetUsersQuery } from '../../application/query/impl/get-users.query';
import { UserResponse } from '../dto/user.response';
import { UpdateUserRequest } from '../dto/update-user.request';
import { UpdateUserCommand } from '../../application/command/impl/update-user.command';
import { ArgumentNotProvideException } from 'src/libs/exception/argument-not-provide.exception';
import { GetUserQuery } from '../../application/query/impl/get-user-by-id.query';
import RequestWithUser from 'src/libs/interface/request-with-user.interface';
import { IdResponse } from '../dto/id.response.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

  @MessagePattern('user_create')
  async createUser(@Body() body: CreateUserRequest): Promise<IdResponse> {
    const command = new CreateUserCommand(body.name, body.email, body.password);
    const result: Result<IdResponse, UserAlreadyExistError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (error) => {
        if (error instanceof UserAlreadyExistError)
          throw new ConflictException(error.message);
        throw error;
      },
    });
  }

  @MessagePattern('user_get_all')
  async getUsers() {
    const query = new GetUsersQuery();
    const result: Result<UserResponse[], UserNotFoundError> =
      await this.queryBus.execute(query);
    return match(result, {
      Ok: (users) => users,
      Err: (error) => {
        if (error instanceof UserNotFoundError)
          throw new NotFoundException(error.message);
        throw error;
      },
    });
  }

  @MessagePattern('user_get_by_id')
  async getUser(@Param('id') id: string) {
    const query = new GetUserQuery(id);
    const result: Result<UserResponse, UserNotFoundError> =
      await this.queryBus.execute(query);
    return match(result, {
      Ok: (user) => user,
      Err: (err) => {
        if (err instanceof UserNotFoundError)
          throw new NotFoundException(err.message);
        throw err;
      },
    });
  }

  @MessagePattern('user_update')
  async updateUser(
    @Param('id') requestedId: string,
    @Body() data: UpdateUserRequest,
    @Req() req: RequestWithUser,
  ) {
    const command = new UpdateUserCommand(
      req.user.id,
      data.name,
      data.password,
      requestedId,
    );
    const result: Result<
      IdResponse,
      AccessDeniedError | ArgumentNotProvideException
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (error) => {
        if (error instanceof AccessDeniedError)
          throw new NotAcceptableException(error.message);
        if (error instanceof ArgumentNotProvideException)
          throw new PreconditionFailedException(error.message);
        throw error;
      },
    });
  }
}
