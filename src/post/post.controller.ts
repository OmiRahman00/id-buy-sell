import { Body, Controller, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
    ) {}


    @ApiOperation({
        summary: 'Creates a new blog post',
      })
      @ApiResponse({
        status: 201,
        description: 'You get a 201 response if your post is created successfully',
      })
    @Post('create')
    public create(
        @Body() createPostDto: CreatePostDto,
    ){
        return this.postService.create(createPostDto);
    }
}
