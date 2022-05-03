import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserSchema } from './user.entity';
import { StoryModule } from 'src/story/story.module';
import { LikeModule } from 'src/like/like.module';
import { PaginationModule } from 'src/pagination/pagination.module';
import { FilterModule } from 'src/filter/filter.module';
import { FollowershipModule } from 'src/followership/followership.module';
import { UserDataloader } from './dataloaders/user.dataloader';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PaginationModule,
    FilterModule,
    forwardRef(() => StoryModule),
    forwardRef(() => LikeModule),
    forwardRef(() => FollowershipModule),
  ],
  providers: [UserService, UserResolver, UserDataloader],
  exports: [UserService, UserDataloader],
})
export class UserModule {}
