import {Injectable, NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common'
import {Observable} from 'rxjs'

@Injectable()
export class CountA implements NestInterceptor{
    intercept(context : ExecutionContext, next:CallHandler):Observable<any>{
        const request = context.switchToHttp().getRequest()
        const body = request.body

        const a = Number(body.a)
        const b = Number(body.b)

        if (a === 0) {
            throw new Error("Not 0")
        }
        body.result = a/b
        return next.handle()
    }

}