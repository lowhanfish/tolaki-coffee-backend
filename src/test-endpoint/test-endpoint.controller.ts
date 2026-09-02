import { Controller, UseInterceptors, Post, Get, Body } from '@nestjs/common';
import { TestEndpointService } from './test-endpoint.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CountA } from 'src/common/interceptors/a.interceptor';
import { TestingDto } from './dto/endpoint';
import { CountB } from 'src/common/interceptors/b.interceptor';



@Controller('test-endpoint')
export class TestEndpointController {
  constructor(private readonly testEndpointService: TestEndpointService) {}

  @Get('check-auth')
  @Public()
  checkAuth(){
    return {
      "message": "Authorized",
      "statusCode": 200
    }
  }

  @Post('test')
  @Public()
  @UseInterceptors(CountA, CountB)
  test(@Body() body:TestingDto){
    return {
      ...body
    }
  }



}
