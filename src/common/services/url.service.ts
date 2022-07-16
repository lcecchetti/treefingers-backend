import { Injectable } from '@nestjs/common';
import Hashids from 'hashids';
import { Forest } from '../../forest/forest.entity';
import { Story } from '../../story/story.entity';
import { User } from '../../user/user.entity';

@Injectable()
export class UrlService {
  hashids = new Hashids('Treefingers', 10);

  encodeId(value: number): string {
    return this.hashids.encode(value);
  }

  decodeId(value: string): number {
    return value && (this.hashids.decode(value)[0] as number);
  }

  getStoryNewUrl(): string {
    return `/story/new`;
  }

  getStoryUrl(story: Story): string {
    return `/story/${this.encodeId(story.id)}`;
  }

  getUserUrl(user: User): string {
    return `/user/${user.username}`;
  }

  getForestUrl(forest: Forest): string {
    return `/forest/${forest.name}`;
  }
}
