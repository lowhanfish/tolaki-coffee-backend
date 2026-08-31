import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {Reflector} from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';


@Injectable()
export class AtAuthGuard extends AuthGuard('jwt-at') {
    constructor(private readonly reflector:Reflector){
        super()
    }

    canActivate(context: ExecutionContext) {
        // Cek metadata di method dan controller.
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        if(isPublic) return true

        return super.canActivate(context);
    }
}