import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

/**
 * @description Data model for users
 * @class
 */
@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  status: boolean;
}
