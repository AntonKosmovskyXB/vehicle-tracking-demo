import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";

import { Track } from "src/entities/track.entity";
import { CreateTrackDto } from "src/dto/create-track.dto";

import { Car } from "src/entities/car.entity";
import { Route } from "src/entities/route.entity";

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

  async findAll(): Promise<Track[]> {
    return this.tracksRepository.find({ relations: ["car"] });
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
