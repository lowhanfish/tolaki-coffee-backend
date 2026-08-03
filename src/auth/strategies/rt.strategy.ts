import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StrategyOptionsWithRequest } from 'passport-jwt'; // Import the type

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({ // Explicitly cast options to StrategyOptionsWithRequest
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const refreshToken = req.cookies?.rt;
          if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
          }
          return refreshToken;
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-fallback', // Added fallback secret
      passReqToCallback: true, // Pass request object to validate method
    } as StrategyOptionsWithRequest);
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.cookies.rt;
    return { ...payload, refreshToken }; // Attach RT to the user object
  }
}