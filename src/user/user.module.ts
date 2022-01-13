import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserSchema } from './user.entity';
import { StoryModule } from 'src/story/story.module';
import { LikeModule } from 'src/like/like.module';
import { QueryModule } from 'src/query/query.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    QueryModule,
    forwardRef(() => StoryModule),
    forwardRef(() => LikeModule),
    forwardRef(() => LikeModule),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
