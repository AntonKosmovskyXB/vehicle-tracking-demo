import { Body, Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserRole } from "src/enums/user-role.enum";

import { Route } from "src/entities/route.entity";
import { CreateRouteDto } from "src/dto/create-route.dto";
import { RoutesService } from "src/services/routes.service";

@ApiBearerAuth("JWT-auth")
@ApiTags("routes")
@Controller("routes")
@UseGuards(JwtAuthGuard)
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Get()
  @Roles(UserRole.Admin)
  findAll(): Promise<Route[]> {
    return this.routesService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.Admin)
  findOne(@Param("id") id: string): Promise<Route> {
    return this.routesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.Admin)
  addRoute(@Body() createRouteDto: CreateRouteDto): Promise<Route> {
    return this.routesService.create(createRouteDto);
  }
}
