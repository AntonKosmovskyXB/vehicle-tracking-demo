import { ApiProperty } from "@nestjs/swagger";

export class ChangeTrackDto {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  type: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  model: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  serial_number: string;

  @ApiProperty({
    type: Number,
    nullable: true,
    required: false,
  })
  carId: number;

  @ApiProperty({
    type: Number,
    nullable: true,
    required: false,
  })
  routeId: number;
}
