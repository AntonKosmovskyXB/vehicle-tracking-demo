import { ApiProperty } from "@nestjs/swagger";

export class CreateCarDto {
  @ApiProperty()
  model: string;

  @ApiProperty()
  state_number: string;
}
