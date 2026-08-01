import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { CurrentUser } from '../dto/current-user.dto';
import { JwtPayload } from '../payloads/jwt.payload';
import { AUTH_COOKIE_NAME } from '../auth.constants';

// non-browser clients (e.g. a future native app) can't rely on cookies, so
// the Authorization header stays supported alongside the auth cookie
const cookieExtractor = (req: Request): string | null =>
  req?.cookies?.[AUTH_COOKIE_NAME] ?? null;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('jwt.secret');
    if (!secret) {
      throw new Error('JWT_SECRET must be set.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUser> {
    // reject activate-account/forgot-password tokens: they are signed with
    // the same secret but must not be usable as API access tokens
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  }
}
