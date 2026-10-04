import { Entity, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class AdminAuthAudit {
  @ObjectIdColumn()
  _id!: ObjectId;

  // Optional — only set if the user IS authenticated
  @Column({ nullable: true })
  userId?: string;

  // The identifier they tried to use (email, username, phone, etc.)
  @Column({ nullable: true })
  attemptedIdentifier?: string;

  @Column()
  action!: string; // 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT', etc.

  @Column({ nullable: true })
  reason?: string; // 'INVALID_CREDENTIALS', 'USER_NOT_FOUND', 'ACCOUNT_LOCKED'

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;
}
