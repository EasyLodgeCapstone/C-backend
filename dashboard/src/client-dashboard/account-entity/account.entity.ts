import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

@Entity()
export class Account {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  name!: string;

  @Column()
  @Index({ unique: true })
  accNumber!: number;

  @Column()
  bankName!: string;
}
