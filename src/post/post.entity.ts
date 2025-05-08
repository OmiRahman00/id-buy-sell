import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CreatePostMetaOptionsDto } from '../meta-options/dtos/create-post-meta-options.dto';
import { postStatus } from './enums/postStatus.enum';
import { postType } from './enums/postType.enum';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { User } from 'src/user/user.entity';
import { Tag } from 'src/tags/tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: postType,
    nullable: false,
    default: postType.SELL,
  })
  postType: postType;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: postStatus,
    nullable: false,
    default: postStatus.PENDING,
  })
  status: postStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImageUrl?: string;

  @Column({
    type: 'timestamp', // 'datetime' in mysql
    nullable: true,
  })
  publishOn?: Date;


   @ManyToMany(()=> Tag,(tag)=>tag.posts,{
    // eager: true, //here is an option to fetch all with relations
   })
   @JoinTable()
  // Work on these in lecture on relationships
  tags?: Tag[];

  @ManyToOne(() => User, (user) => user.posts)
  author: User;
  
  @OneToOne(() => MetaOption,(MetaOption)=> MetaOption.post ,{
    // cascade: ['insert', 'remove'],
    cascade: true,
    eager: true,
  })
  metaOption?: MetaOption;
}