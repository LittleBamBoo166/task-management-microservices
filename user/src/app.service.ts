/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Connection, createConnection } from 'typeorm';
import { DataSourceOptions } from 'typeorm';
import { User } from './user/infrastructure/user.orm-entity';

export const Ormconfig: DataSourceOptions = {
  type: 'postgres',
  host: 'tiny.db.elephantsql.com',
  port: 5432,
  username: 'hnrziazs',
  password: '3NlBgPxG4NL-oksd2d6YTHGUM3Ja4HpF',
  database: 'hnrziazs',
  entities: [User],
  synchronize: true,
  ssl: true,
};

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private databaseConnection?: Connection | void;

  // close the database connection when app module destroyed
  async onModuleDestroy() {
    if (this.databaseConnection) await this.databaseConnection.close();
  }

  // create database connection when init the app module
  async onModuleInit(): Promise<void> {
    this.databaseConnection = await createConnection(Ormconfig).catch(
      (error: Error) => this.failToConnectDatabase(error),
    );
  }

  // error
  private failToConnectDatabase(error: Error): void {
    console.log(error);
    process.exit(1);
  }
}
