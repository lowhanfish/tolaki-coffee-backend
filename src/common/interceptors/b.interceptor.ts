import {Injectable, NestInterceptor, ExecutionContext, CallHandler} from "@nestjs/common"
import { Observable } from "rxjs"


export class CountB implements NestInterceptor {
    intercept(context : ExecutionContext, next: CallHandler):Observable<any>{
        const request = context.switchToHttp().getRequest()
        const body = request.body
        const type =  (body.result % 2 == 0) ?  'Constant' :  'Decimal';
        body.typex = type
        return next.handle()
    }
}