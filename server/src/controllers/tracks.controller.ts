import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Patch,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DeleteResult } from "typeorm";

import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserRole } from "src/enums/user-role.enum";

import { Track } from "src/entities/track.entity";
import { CreateTrackDto } from "src/dto/create-track.dto";
import { ChangeTrackDto } from "src/dto/change-track.dto";
import { TracksService } from "src/services/tracks.service";

@ApiBearerAuth("JWT-auth")
@ApiTags("tracks")
@Controller("tracks")
@UseGuards(JwtAuthGuard)
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @Roles(UserRole.Admin)
  async findAll(): Promise<Track[]> {
    return this.tracksService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.Admin)
  async findOne(@Param("id") id: number): Promise<Track> {
    return this.tracksService.findOne(id);
  }

  @Post()
  @Roles(UserRole.Admin)
  async addTrack(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.tracksService.create(createTrackDto);
  }

  @Patch(":id")
  @Roles(UserRole.Admin)
  async changeTrack(
    @Param("id") id: number,
    @Body() changeTrackDto: ChangeTrackDto
  ): Promise<Track> {
    return this.tracksService.change(id, changeTrackDto);
  }

  @Delete(":id")
  @Roles(UserRole.Admin)
  async deleteTrack(@Param("id") id: number): Promise<DeleteResult> {
    return this.tracksService.remove(id);
  }
}
