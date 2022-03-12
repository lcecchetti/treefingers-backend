import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { StoryModule } from './story/story.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import config from './app.config';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ForestModule } from './forest/forest.module';
import { UtilsModule } from './utils/utils.module';
import { FilterModule } from './filter/filter.module';
import { PaginationModule } from './pagination/pagination.module';
import { MembershipModule } from './membership/membership.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    UtilsModule,
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: configService.get<string>('graphql.schema'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    StoryModule,
    UserModule,
    AuthModule,
    CommentModule,
    LikeModule,
    ForestModule,
    FilterModule,
    PaginationModule,
    MembershipModule,
  ],
  providers: [AppService],
})
export class AppModule {}
