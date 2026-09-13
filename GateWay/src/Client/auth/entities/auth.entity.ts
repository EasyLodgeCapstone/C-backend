import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from 'src/Admin/admin-auth/entities/user.entity';

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
