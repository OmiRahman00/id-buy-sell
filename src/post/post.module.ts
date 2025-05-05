import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { UserModule } from 'src/user/user.module';
import { MetaOptionsModule } from 'src/meta-options/meta-options.module';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Post,MetaOption]),UserModule, MetaOptionsModule],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
