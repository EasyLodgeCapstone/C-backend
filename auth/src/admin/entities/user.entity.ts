// import { ObjectId } from "mongodb";
import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

export enum Role {
  Admin = 'admin',
  User = 'user',
}

@Entity()
export class User {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  @Index({
    unique: true,
    sparse: true, // Only enforce uniqueness when email exists
  })
  name!: string;

  @Column()
  @Index({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: Role;
}
