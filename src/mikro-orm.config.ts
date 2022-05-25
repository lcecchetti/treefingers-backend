import { Options } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const MikroOrmConfig: Options = {
  entities: ['dist/**/*.entity'],
  entitiesTs: ['src/**/*.entity'],
  type: configService.get('database.type'),
  dbName: configService.get<string>('database.name'),
  user: configService.get<string>('database.user'),
  password: configService.get<string>('database.password'),
  host: configService.get<string>('database.host'),
  port: configService.get<number>('database.port'),
  debug: configService.get<boolean>('env.isDev'),
};

export default MikroOrmConfig;
