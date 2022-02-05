import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DeleteResult } from "typeorm";

import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

import { User } from "src/entities/user.entity";
import { UsersService } from "src/services/users.service";
import { CreateUserDto } from "src/dto/create-user.dto";
import { Roles } from "src/auth/roles.decorator";
import { UserRole } from "src/enums/user-role.enum";

@ApiBearerAuth("JWT-auth")
@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersServices: UsersService) {}

  @Post()
  @Roles(UserRole.Admin)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersServices.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.Admin)
  async findAll(): Promise<User[]> {
    return this.usersServices.findAll();
  }

  @Get(":id")
  @Roles(UserRole.Admin)
  async findOne(@Param("id") id: number): Promise<User> {
    return this.usersServices.findOne(id);
  }

  @Delete(":id")
  @Roles(UserRole.Admin)
  async remove(@Param("id") id: number): Promise<DeleteResult> {
    return this.usersServices.remove(id);
  }
}
