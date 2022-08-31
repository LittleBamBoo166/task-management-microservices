/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module, Provider } from '@nestjs/common';
import { UserController } from './interface/controller/user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './application/command/handler';
import { InjectionToken } from './application/injection.token';
import { UserFactory } from './domain/user.factory';
import { queryHandlers } from './application/query/handler';
import { UserRepositoryAdapter } from './infrastructure/user.repository';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.USER_REPOSITORY,
    useClass: UserRepositoryAdapter,
  },
];

const domain = [UserFactory];

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...infrastructure,
    ...domain,
  ],
})
export class UserModule {}
