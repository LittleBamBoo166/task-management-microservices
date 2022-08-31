/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
