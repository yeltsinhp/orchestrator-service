import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterClientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  identityDocument: string;
}
