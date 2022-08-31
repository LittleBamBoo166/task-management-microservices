/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ update: false })
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false, nullable: true })
  refreshToken: string;

  constructor(id: string) {
    this.id = id;
  }
}
