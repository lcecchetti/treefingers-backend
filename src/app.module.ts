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
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
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
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';
import type { Constructor, IDatabaseDriver } from '@mikro-orm/core';
import { CommonModule } from './common/common.module';
import { NotificationModule } from './notification/notification.module';
import { ThrottlerModule } from '@nestjs/throttler';

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
      useFactory: async (configService: ConfigService) => {
        const webUrl = configService.get<string>('frontend.webUrl');
        if (!webUrl) {
          // an unset CORS origin can silently fall back to permissive
          // behavior in some setups; with credentials: true that's a real
          // cross-origin credential leak risk, so refuse to boot instead
          throw new Error(
            'FRONTEND_WEBURL must be set — it is required as the CORS origin allowlist.',
          );
        }

        return {
          autoSchemaFile: configService.get<string>('graphql.schema'),
          cors: {
            origin: webUrl,
            credentials: true,
          },
          // res is needed to set/clear the auth cookie from the login/logout resolvers
          context: ({ req, res }) => ({ req, res }),
        };
      },
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // Typed as the base driver interface rather than letting `D` narrow to
      // `PostgreSqlDriver`: pinning `D` there trips a structural mismatch
      // between `PostgreSqlDriver` and `IDatabaseDriver` deep in
      // `@mikro-orm/nestjs`'s generic (its schema generator getter isn't
      // assignable to `ISchemaGenerator` under strict structural typing).
      // The class itself is unaffected — this only changes what TS infers
      // `D` as. Still required at runtime: without it, `@mikro-orm/nestjs`
      // can't synchronously register the driver-specific EntityManager
      // subclass DI token (it needs the driver class before the async
      // `useFactory`, which depends on injected providers, has resolved).
      driver: PostgreSqlDriver as unknown as Constructor<IDatabaseDriver>,
      useFactory: (configService: ConfigService) => ({
        driver: PostgreSqlDriver,
        clientUrl: configService.get<string>('database.url'),
        debug: configService.get<boolean>('env.isDev'),
        autoLoadEntities: true,
        metadataProvider: ReflectMetadataProvider,
        driverOptions: {
          ssl: !configService.get<boolean>('env.isDev'),
        },
        schemaGenerator: {
          defaultUpdateRule: 'cascade',
        },
        extensions: [Migrator],
        migrations: {
          pathTs: 'src/migrations',
          path: 'dist/migrations',
          disableForeignKeys: false,
        },
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
    ThrottlerModule.forRoot({
      throttlers: [
        {
          // ttl is in milliseconds since v3; 60_000ms / 10 requests preserves
          // the pre-upgrade 60s-window / 10-request policy
          ttl: 60_000,
          limit: 10,
        },
      ],
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
    NotificationModule,
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
