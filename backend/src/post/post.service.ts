import {Injectable} from '@nestjs/common';
import {Post} from '../models/post';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from '../models/user';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private readonly postRepo: Repository<Post>) {}

  getPosts(): Promise<Post[]> {
    return this.postRepo
      .createQueryBuilder('post')
      .innerJoin("post.author", "author")
      .addSelect(["author.login", "author.avatar", "author.id"])
      .leftJoinAndSelect('post.tags', 'tags')
      .loadRelationCountAndMap('post.comments', 'post.comments')
      .getMany();
  }

  async create(postDto: Post, user: User): Promise<Post> {
    const post = this.postRepo.create(postDto);

    post.author = user;
    await this.postRepo.save(post);

    return post;
  }

  async getPostsForUser(id: number): Promise<Post[]> {
    return this.postRepo
      .createQueryBuilder('post')
      .innerJoin('post.author', 'author')
      .addSelect(['author.login', 'author.avatar', 'author.id'])
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.authorId = :id', {id})
      .loadRelationCountAndMap('post.comments', 'post.comments')
      .getMany();
  }

  async getPostById(id: number): Promise<Post> {
    return this.postRepo
      .createQueryBuilder('post')
      .innerJoin('post.author', 'author')
      .addSelect(['author.login', 'author.avatar', 'author.id'])
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.id = :id', {id})
      .loadRelationCountAndMap('post.comments', 'post.comments')
      .getOne();
  }

  async findPostsByTag(id: string): Promise<Post[]> {
    const postIds = await this.getPostIds(id);
    return this.postRepo
      .createQueryBuilder('post')
      .innerJoin("post.author", "author")
      .addSelect(["author.login", "author.avatar", "author.id"])
      .leftJoinAndSelect('post.tags', 'tags')
      .loadRelationCountAndMap('post.comments', 'post.comments')
      .whereInIds(postIds)
      .getMany();
  }

  private async getPostIds(id: string) {
    const posts: Post[] = await this.postRepo
      .createQueryBuilder('post')
      .select('post.id')
      .innerJoin("post.author", "author")
      .leftJoinAndSelect('post.tags', 'tags')
      .where('tags.id = :id', {id})
      .getMany();

    return posts.map(post => post.id);
  }
}
