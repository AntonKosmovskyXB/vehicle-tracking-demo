import { ApiProperty } from "@nestjs/swagger";

export class CreateCarDto {
  @ApiProperty()
  model: string;

  @ApiProperty()
  state_number: string;

  @ApiProperty({
    type: String,
    format: "binary",
    nullable: true,
    required: false,
  })
  image?: Express.Multer.File;
}
