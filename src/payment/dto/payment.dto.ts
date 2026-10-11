import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class ReadPayment {
  @IsString()
  orderId: string;

  @IsString()
  productName: string;
}
