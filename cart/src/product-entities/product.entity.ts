import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn, Unique } from 'typeorm';

@Entity()
export class Product {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  @Unique(['productName'])
  @Index()
  productName!: string;

  @Column()
  productDescription!: string;

  @Column()
  productPrice!: number;

  @Column()
  category!: string;

  @Column()
  subCategory!: string;

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

  @Column()
  stockQuantity!: number;

  @Column()
  isInStock?: boolean = true;
}
