// Must load before any entity class is decorated: MikroORM's
// ReflectMetadataProvider (see app.module.ts) reads TS's emitted
// design:type metadata, which requires the Reflect.metadata polyfill to
// already be in place at class-decoration time.
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });
  app.use(cookieParser());
  app.enableShutdownHooks();
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('env.port', 3000));
}
bootstrap();
