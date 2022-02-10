import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";

import { Track } from "src/entities/track.entity";
import { CreateTrackDto } from "src/dto/create-track.dto";
import { ChangeTrackDto } from "src/dto/change-track.dto";

import { Car } from "src/entities/car.entity";
import { Route } from "src/entities/route.entity";
import { CarsService } from "./cars.service";
import { RoutesService } from "./routes.service";

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly tracksRepository: Repository<Track>,
    @InjectRepository(Car)
    private readonly carsRepository: Repository<Car>,
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const car = await this.carsRepository.findOneOrFail(createTrackDto.carId);
    const route = await this.routeRepository.findOneOrFail(
      createTrackDto.routeId
    );
    const track = new Track();
    track.car = car;
    track.route = route;
    track.type = createTrackDto.type;
    track.model = createTrackDto.model;
    track.serial_number = createTrackDto.serial_number;
    return this.tracksRepository.save(track);
  }

  async change(id: number, changeTrackDto: ChangeTrackDto): Promise<Track> {
    if (id != changeTrackDto.id) {
      throw new BadRequestException();
    }

    const track = await this.findOne(id);
    if (changeTrackDto.model) {
      track.model = changeTrackDto.model;
    }

    if (changeTrackDto.type) {
      track.type = changeTrackDto.type;
    }

    if (changeTrackDto.serial_number) {
      track.serial_number = changeTrackDto.serial_number;
    }

    if (changeTrackDto.carId) {
      track.car = await this.carsRepository.findOneOrFail(changeTrackDto.carId);
    }

    if (changeTrackDto.routeId) {
      track.route = await this.routeRepository.findOneOrFail(changeTrackDto.routeId);
    }

    return this.tracksRepository.save(track);
  }

  async findAll(): Promise<Track[]> {
    return this.tracksRepository.find({ relations: ["car", "route"] });
  }

  async findOne(id: number): Promise<Track> {
    return this.tracksRepository.findOneOrFail(id, {
      relations: ["car", "route"],
    });
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.tracksRepository.delete(id);
  }
}
