import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Cart {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  @Index()
  userId!: ObjectId;

  @Column()
  @Index()
  productId!: ObjectId;

  @Column()
  productQuantity!: number;

  @Column()
  @Unique(['productName'])
  @Index()
  productName!: string;

  @Column()
  productDescription!: string;

  @Column()
  productPrice!: number;

  @Column()
  subTotal!: number;

  @Column()
  perTotal!: number;

  @Column()
  @Index({
    sparse: true, // Only index documents that have this field
  })
  discountPrice?: number;

  @Column()
  productFeatures!: string;

  @Column()
  texture?: string;

  @Column()
  scent?: string;

  @Column()
  color?: string;

  @Column()
  packaging?: string;

  @Column()
  images!: string[];
  @Column()
  thumbnailImage?: string;

  @Column()
  videoUrl?: string;

  @Column()
  averageRating?: number;

  @Column()
  totalReviews?: number = 0;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
