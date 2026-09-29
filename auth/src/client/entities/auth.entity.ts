import { ObjectId } from 'mongodb';
import { Role } from 'src/admin/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class clientUser {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  @Index({
    unique: true,
    sparse: true, // Only enforce uniqueness when email exists
  })
  userName!: string;

  @Column()
  @Index({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: Role;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
