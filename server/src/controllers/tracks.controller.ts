import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DeleteResult } from "typeorm";

import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserRole } from "src/enums/user-role.enum";

import { Track } from "src/entities/track.entity";
import { CreateTrackDto } from "src/dto/create-track.dto";
import { TracksService } from "src/services/tracks.service";

@ApiBearerAuth("JWT-auth")
@ApiTags("tracks")
@Controller("tracks")
@UseGuards(JwtAuthGuard)
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @Roles(UserRole.Admin)
  findAll(): Promise<Track[]> {
    return this.tracksService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.Admin)
  findOne(@Param("id") id: string): Promise<Track> {
    return this.tracksService.findOne(id);
  }

  @Post()
  @Roles(UserRole.Admin)
  addTrack(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.tracksService.create(createTrackDto);
  }

  @Delete(":id")
  @Roles(UserRole.Admin)
  deleteTrack(@Param("id") id: string): Promise<DeleteResult> {
    return this.tracksService.remove(id);
  }
}
