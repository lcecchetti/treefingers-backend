import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { ConfigService } from '@nestjs/config';
import { IsAuthenticatedGuard } from './guards/is-authenticated.guard';
import { NotificationModule } from '../notification/notification.module';
import type { StringValue } from 'ms';

@Module({
  imports: [
    UserModule,
    NotificationModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<StringValue>('jwt.expiration'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    LocalStrategy,
    JwtStrategy,
    IsAuthenticatedGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
