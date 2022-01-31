import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Delete,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { DeleteResult } from "typeorm";
import { FileInterceptor } from "@nestjs/platform-express";

import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserRole } from "src/enums/user-role.enum";

import { Car } from "src/entities/car.entity";
import { CreateCarDto } from "src/dto/create-car.dto";
import { CarsService } from "src/services/cars.service";

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
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("image"))
  @Roles(UserRole.Admin)
  addCar(
    @Body() createCarDto: CreateCarDto,
    @UploadedFile() image: Express.Multer.File
  ): Promise<Car> {
    console.log(image);
    return this.carsService.create(createCarDto, image);
  }

  @Delete(":id")
  @Roles(UserRole.Admin)
  deleteCar(@Param("id") id: string): Promise<DeleteResult> {
    return this.carsService.remove(id);
  }
}
