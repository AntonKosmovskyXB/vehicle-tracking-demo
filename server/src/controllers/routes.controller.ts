import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserRole } from "src/enums/user-role.enum";

import { Route } from "src/entities/route.entity";
import { CreateRouteDto } from "src/dto/create-route.dto";
import { ChangeRouteDto } from "src/dto/change-route.dto";
import { RoutesService } from "src/services/routes.service";

@ApiBearerAuth("JWT-auth")
@ApiTags("routes")
@Controller("routes")
@UseGuards(JwtAuthGuard)
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  @Roles(UserRole.Admin)
  async findAll(): Promise<Route[]> {
    return this.routesService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.Admin)
  async findOne(@Param("id") id: number): Promise<Route> {
    return this.routesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.Admin)
  async addRoute(@Body() createRouteDto: CreateRouteDto): Promise<Route> {
    return this.routesService.create(createRouteDto);
  }

  @Patch(":id")
  @Roles(UserRole.Admin)
  async changeRoute(
    @Param("id") id: number,
    @Body() changeRouteDto: ChangeRouteDto
  ): Promise<Route> {
    return this.routesService.change(id, changeRouteDto);
  }
}
