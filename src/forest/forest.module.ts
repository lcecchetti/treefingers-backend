import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForestService } from './forest.service';
import { ForestResolver } from './forest.resolver';
import { ForestSchema } from './forest.entity';
import { StoryModule } from 'src/story/story.module';
import { UserModule } from 'src/user/user.module';
import { CommentModule } from 'src/comment/comment.module';
import { PaginationModule } from 'src/pagination/pagination.module';
import { FilterModule } from 'src/filter/filter.module';
import { MembershipModule } from 'src/membership/membership.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Forest', schema: ForestSchema }]),
    PaginationModule,
    FilterModule,
    forwardRef(() => StoryModule),
    forwardRef(() => UserModule),
    forwardRef(() => CommentModule),
    forwardRef(() => MembershipModule),
  ],
  providers: [ForestService, ForestResolver],
  exports: [ForestService],
})
export class ForestModule {}
