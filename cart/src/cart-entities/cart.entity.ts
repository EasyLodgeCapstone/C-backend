import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Cart {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  userId!: ObjectId;

  @Column()
  productId!: ObjectId;

  @Column()
  productQuantity!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
