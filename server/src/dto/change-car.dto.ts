import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ChangeCarDto {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  model?: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  state_number?: string;

  @ApiProperty({
    type: Number,
    nullable: true,
    required: false,
  })
  userId?: number;

  @ApiProperty({
    type: Number,
    nullable: true,
    required: false,
  })
  trackId?: number;

  @ApiProperty({
    type: Number,
    nullable: true,
    required: false,
  })
  imageId?: number;
}
