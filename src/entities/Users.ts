import {
  Entity, Column, PrimaryGeneratedColumn, ManyToMany, 
  BaseEntity, JoinTable
} from 'typeorm';

@Entity()
export class Users extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  sexo: string;

  @Column({unique: true})
  cedula: string;
  
  @Column()
  fechaIngreso: Date

  @Column()
  rol: string
}