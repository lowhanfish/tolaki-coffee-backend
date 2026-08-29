import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import {RefreshTokenPayload} from '../interfaces/auth.interfaces'
import {REFRESH_TOKEN_COOKIE} from '../constants/auth.constant'
import { Request } from 'express';

@Injectable()
export class RtAuthStrategy extends PassportStrategy(Strategy, 'jwt-rt') {
  constructor() {
    const secret = process.env.JWT_REFRESH_SECRET
    if(!secret) throw new Error('JWT_REFRESH_SECRET is not configured')

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request : {cookies?:Record<string, string> })=>{
            return request?.cookies?.[REFRESH_TOKEN_COOKIE]?? null
        }
      ]),
      ignoreExpiration : false,
      secretOrKey: secret,
      passReqToCallback : true
    } as StrategyOptionsWithRequest);
  }

  async validate(request:Request, payload: RefreshTokenPayload) {
    if(payload?.type !== 'refresh' || !payload.sub || !payload.email){
        throw new UnauthorizedException("Payload refresh token invalid..!")
    }

    return {
        userId: payload.sub,
        email: payload.email,
        refreshToken: request.cookies?.[REFRESH_TOKEN_COOKIE],
    };
  }
}