import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "src/enums/user-role.enum";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({
    type: Number,
  })
  companyId: number;
  
  @ApiProperty()
  carId: number;

  @ApiProperty({
    enum: UserRole,
  })
  role: UserRole;
}
