import { Module, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PaginationModule } from './pagination/pagination.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ComplexityPlugin } from './graphql/complexity.plugin';
import { DataloaderModule } from '@tracworx/nestjs-dataloader';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import config from './app.config';
import { QueryModule } from './query/query.module';
import { FollowershipModule } from './followership/followership.module';
import { ForestModule } from './forest/forest.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { MembershipModule } from './membership/membership.module';
import { StoryModule } from './story/story.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CommonModule } from './common/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      cache: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: configService.get<string>('graphql.schema'),
        cors: {
          origin: configService.get<string>('frontend.webUrl'),
          credentials: true,
        },
        bodyParserConfig: false,
      }),
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgresql',
        clientUrl: configService.get<string>('database.url'),
        debug: configService.get<boolean>('env.isDev'),
        autoLoadEntities: true,
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: configService.get<string>('email.service'),
          auth: {
            user: configService.get<string>('email.user'),
            pass: configService.get<string>('email.password'),
          },
        },
        defaults: {
          from: `"Treefingers" <${configService.get<string>('email.user')}>`,
        },
        template: {
          dir: process.cwd() + '/src/email-templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    CommonModule,
    DataloaderModule,
    QueryModule,
    PaginationModule,
    AuthModule,
    UserModule,
    FollowershipModule,
    ForestModule,
    CommentModule,
    LikeModule,
    MembershipModule,
    StoryModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AppService,
    ComplexityPlugin,
  ],
})
export class AppModule {}
