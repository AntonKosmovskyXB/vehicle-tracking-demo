import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";

import { Track } from "src/entities/track.entity";
import { CreateTrackDto } from "src/dto/create-track.dto";

import { Car } from "src/entities/car.entity";

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly tracksRepository: Repository<Track>,
    @InjectRepository(Car)
    private readonly carsRepository: Repository<Car>
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const car = await this.carsRepository.findOneOrFail(createTrackDto.carId);

    const track = new Track();
    track.car = car;
    track.type = createTrackDto.type;
    track.model = createTrackDto.model;
    track.serial_number = createTrackDto.serial_number;
    return this.tracksRepository.save(track);
  }

  findAll(): Promise<Track[]> {
    return this.tracksRepository.find({ relations: ["car"] });
  }

  findOne(id: string): Promise<Track> {
    return this.tracksRepository.findOneOrFail(id, { relations: ["car"] });
  }

  remove(id: string): Promise<DeleteResult> {
    return this.tracksRepository.delete(id);
  }
}
