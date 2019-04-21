import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  Request,
  Post,
  Body,
  Param,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Post as PostModel } from '../models/post';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async posts(): Promise<PostModel[]> {
    return this.postService.getPosts();
  }

  @Get('/profile')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard())
  async getPostsForProfile(@Request() req): Promise<PostModel[]> {
    return await this.postService.getPostsForUser(req.user.id);
  }

  @Get('/:id')
  async getPostsById(@Param('id') id: number): Promise<PostModel> {
    const res = await this.postService.getPostById(id);
    if (!res) {
      throw new HttpException(`Post with id ${id} not found`, 404);
    }
    return res;
  }

  @Get('/user/:id')
  async getPostsForUser(@Param('id') id): Promise<PostModel[]> {
    return await this.postService.getPostsForUser(id);
}

  @Post('/create')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard())
  async create(@Body() postDto: PostModel, @Request() req): Promise<PostModel> {
    return await this.postService.create(postDto, req.user);
  }
}
