import { ApiProperty } from "@nestjs/swagger";

export class CoordinatesDto {
  @ApiProperty({
    type: Number,
  })
  lat: number;

  @ApiProperty({
    type: Number,
  })
  lng: number;
}

export class CreateRouteDto {
  @ApiProperty({
    type: Number,
  })
  distance: number;

  @ApiProperty({
    type: Number,
  })
  speed: number;

  @ApiProperty({
    type: Number,
  })
  travelTime: number;

  @ApiProperty()
  route: string;

  @ApiProperty()
  deliveryAdress: string;

  @ApiProperty({
    type: () => CoordinatesDto,
  })
  coords: CoordinatesDto;

  @ApiProperty({
    type: () => CoordinatesDto,
  })
  startCoords: CoordinatesDto;

  @ApiProperty({
    type: [Number],
  })
  alternativesIds: number[];
}
