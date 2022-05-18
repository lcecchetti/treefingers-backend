import { Module, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';
import { PaginationModule } from './pagination/pagination.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ComplexityPlugin } from './graphql/complexity.plugin';
import { DataloaderModule } from '@tracworx/nestjs-dataloader';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './app.config';
import { QueryModule } from './query/query.module';
import { FollowershipModule } from './followership/followership.module';
import { ForestModule } from './forest/forest.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { MembershipModule } from './membership/membership.module';
import { StoryModule } from './story/story.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      cache: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: configService.get<string>('graphql.schema'),
        cors: {
          origin: configService.get<string>('frontend.webUrl'),
          credentials: true,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        autoLoadEntities: true,
        type: 'postgres',
        host: configService.get<string>('database.host', 'localhost'),
        port: configService.get<number>('database.port', 5432),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        synchronize: configService.get<boolean>('env.isDev'),
        logging: configService.get<boolean>('env.isDev'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
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
      inject: [ConfigService],
    }),
    UtilsModule,
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
