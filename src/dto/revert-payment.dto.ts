import { IsInt, IsNotEmpty } from 'class-validator';

export class RevertPaymentDto {
  @IsInt()
  @IsNotEmpty()
  paymentId: number;
}
