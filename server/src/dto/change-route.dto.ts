import { ApiProperty } from "@nestjs/swagger";
import { CoordinatesDto } from "./create-route.dto";

export class ChangeRouteDto {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: Number,
    nullable: true,
    required: false,
  })
  distance: number;

  @ApiProperty({
    type: Number,
    nullable: true,
    required: false,
  })
  speed: number;

  @ApiProperty({
    type: Number,
    nullable: true,
    required: false,
  })
  travelTime: number;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  route: string;

  @ApiProperty({
    nullable: true,
    required: false,
  })
  deliveryAdress: string;

  @ApiProperty({
    type: () => CoordinatesDto,
    nullable: true,
    required: false,
  })
  coords: CoordinatesDto;

  @ApiProperty({
    type: () => CoordinatesDto,
    nullable: true,
    required: false,
  })
  startCoords: CoordinatesDto;

  @ApiProperty({
    type: [Number],
    nullable: true,
    required: false,
  })
  alternativesIds: number[];
}
