import { IsInt, IsNotEmpty } from 'class-validator';

export class CancelBookingDto {
  @IsInt()
  @IsNotEmpty()
  flightId: number;

  @IsInt()
  @IsNotEmpty()
  seatNumber: number;
}
