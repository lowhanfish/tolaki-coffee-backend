import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {AccessTokenPayload} from '../interfaces/auth.interfaces'
import { ACCESS_TOKEN_COOKIE } from '../constants/auth.constant';
import {Request} from 'express'

// AtStrategy (Access Token Strategy) hanya bertugas memvalidasi access token.
// Access token dipakai untuk membuka endpoint private seperti /profile.
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-at') {
  constructor() {

    const secret = process.env.JWT_ACCESS_SECRET;
    if(!secret) throw new Error('JWT_ACCESS_SECRET is not configured')

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // // Array ke 1
        // (request: Request) => {
        //   return request.cookies?.[ACCESS_TOKEN_COOKIE] ?? null;
        // },

        // Aman dipasang di Express maupun Fastify!
        (request : {cookies? : Record<string, string>})=>{
          return request?.cookies?.[ACCESS_TOKEN_COOKIE] ?? null
        },
        // Array ke 2 
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
     ignoreExpiration : false,
     secretOrKey : secret
    });
  }

  async validate(payload: AccessTokenPayload) {
    if(payload?.type !== 'access' || !payload.sub || !payload.email){
      throw new UnauthorizedException("Access token invalid..!")
    }
    return {
      userId : payload.sub,
      email : payload.email
    }
  }
}