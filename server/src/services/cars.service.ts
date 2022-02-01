import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult } from "typeorm";

import { Car } from "src/entities/car.entity";
import { CreateCarDto } from "src/dto/create-car.dto";

import { Attachment } from "src/entities/attachment.entity";
import { AttachmentsService } from "./attachments.service";

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carsRepository: Repository<Car>,
    private readonly attachmentsService: AttachmentsService
  ) {}

  async create(
    createCarDto: CreateCarDto,
    image: Express.Multer.File
  ): Promise<Car> {
    const car = new Car();
    car.model = createCarDto.model;
    car.state_number = createCarDto.state_number;
    const attachment = await this.attachmentsService.create(image);
    car.image = attachment;
    return this.carsRepository.save(car);
  }

  findAll(): Promise<Car[]> {
    return this.carsRepository.find({ relations: ["track", "user", "image"] });
  }

  findOne(id: string): Promise<Car> {
    return this.carsRepository.findOneOrFail(id, {
      relations: ["track", "user", "image"],
    });
  }

  remove(id: string): Promise<DeleteResult> {
    return this.carsRepository.delete(id);
  }
}
