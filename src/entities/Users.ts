import {
  Entity, Column, PrimaryGeneratedColumn, 
  BaseEntity
} from 'typeorm';

@Entity()
export class Users extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @Column()
  password: string;

  @Column()
  address: string

  @Column({unique: true})
  email: string;
}