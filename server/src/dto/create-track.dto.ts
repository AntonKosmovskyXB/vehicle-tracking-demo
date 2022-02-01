import { ApiProperty } from "@nestjs/swagger";

export class CreateTrackDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  serial_number: string;

  @ApiProperty({
    type: Number,
  })
  carId: number;
}
