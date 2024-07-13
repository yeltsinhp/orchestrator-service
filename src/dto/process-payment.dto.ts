import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class ProcessPaymentDto {
  @IsInt()
  @IsNotEmpty()
  clientId: number;

  @IsInt()
  @IsNotEmpty()
  reservationId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
