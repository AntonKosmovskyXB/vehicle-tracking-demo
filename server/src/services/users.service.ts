import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";

import { User } from "src/entities/user.entity";
import { Car } from "src/entities/car.entity";
import { UserRole } from "src/enums/user-role.enum";
import { Company } from "src/entities/company.entity";
import { CreateUserDto } from "src/dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(Car)
    private readonly carsRepository: Repository<Car>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const company = await this.companiesRepository.findOneOrFail(
      createUserDto.companyId
    );

    const car = await this.carsRepository.findOneOrFail(createUserDto.carId);

    const user = new User();
    user.role = createUserDto.role;
    user.company = company;
    user.car = car;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.phoneNumber = createUserDto.phoneNumber;

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ["car", "company"] });
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOneOrFail(id, {
      relations: ["car", "company"],
    });
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}
