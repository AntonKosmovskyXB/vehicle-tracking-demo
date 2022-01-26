import { Body, Controller, Get, Post, Param, UseGuards, Delete } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { Car } from "src/entities/car.entity";
import { CreateCarDto } from "src/dto/create-car.dto";
import { CarsService } from "src/services/cars.service";

import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserRole } from "src/enums/user-role.enum";
import { DeleteResult } from "typeorm";

@ApiBearerAuth("JWT-auth")
@ApiTags("cars")
@Controller("cars")
@UseGuards(JwtAuthGuard)
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  @Roles(UserRole.Admin)
  findAll(): Promise<Car[]> {
    return this.carsService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.Admin)
  findOne(@Param("id") id: string): Promise<Car> {
    return this.carsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.Admin)
  addCar(@Body() createCarDto: CreateCarDto): Promise<Car> {
    return this.carsService.create(createCarDto);
  }

  @Delete(":id")
  @Roles(UserRole.Admin)
  deleteCar(@Param("id") id: string): Promise<DeleteResult> {
    return this.carsService.remove(id);
  }
}
