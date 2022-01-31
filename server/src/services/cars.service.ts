import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult } from "typeorm";

import { Car } from "src/entities/car.entity";
import { CreateCarDto } from "src/dto/create-car.dto";

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carsRepository: Repository<Car>
  ) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    const car = new Car();
    car.model = createCarDto.model;
    car.state_number = createCarDto.state_number;
    return this.carsRepository.save(car);
  }

  findAll(): Promise<Car[]> {
    return this.carsRepository.find({ relations: ["track", "user"] });
  }

  findOne(id: string): Promise<Car> {
    return this.carsRepository.findOneOrFail(id, { relations: ["track", "user"] });
  }

  remove(id: string): Promise<DeleteResult> {
    return this.carsRepository.delete(id);
  }
}
