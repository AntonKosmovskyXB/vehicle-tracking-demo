import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult } from "typeorm";

import { Car } from "src/entities/car.entity";
import { CreateCarDto } from "src/dto/create-car.dto";
import { ChangeCarDto } from "src/dto/change-car.dto";

import { AttachmentsService } from "./attachments.service";
import { TracksService } from "./tracks.service";
import { UsersService } from "./users.service";

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carsRepository: Repository<Car>,
    private readonly attachmentsService: AttachmentsService,
    private readonly tracksService: TracksService,
    private readonly usersService: UsersService
  ) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    const car = new Car();
    car.model = createCarDto.model;
    car.state_number = createCarDto.state_number;

    if (createCarDto.image?.size >= 0) {
      car.image = await this.attachmentsService.create(createCarDto.image);
    }

    return this.carsRepository.save(car);
  }

  async change(id: number, changeCarDto: ChangeCarDto): Promise<Car> {
    if (id != changeCarDto.id) {
      throw new BadRequestException();
    }

    const car = await this.findOne(id);
    if (changeCarDto.model) {
      car.model = changeCarDto.model;
    }

    if (changeCarDto.state_number) {
      car.state_number = changeCarDto.state_number;
    }

    if (changeCarDto.userId) {
      car.user = await this.usersService.findOne(changeCarDto.userId);
    }

    if (changeCarDto.trackId) {
      car.track = await this.tracksService.findOne(changeCarDto.trackId);
    }

    if (changeCarDto.imageId) {
      car.image = await this.attachmentsService.findOne(changeCarDto.imageId);
    }

    return this.carsRepository.save(car);
  }

  async findAll(): Promise<Car[]> {
    return this.carsRepository.find({ relations: ["track", "user", "image"] });
  }

  async findOne(id: number): Promise<Car> {
    return this.carsRepository.findOneOrFail(id, {
      relations: ["track", "user", "image"],
    });
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.carsRepository.delete(id);
  }
}
