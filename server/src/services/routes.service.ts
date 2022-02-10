import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Route } from "src/entities/route.entity";
import { CreateRouteDto } from "src/dto/create-route.dto";
import { ChangeRouteDto } from "src/dto/change-route.dto";

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly routesRepository: Repository<Route>
  ) {}
 
  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    
    const route = new Route();

    route.distance = createRouteDto.distance;
    route.speed = createRouteDto.speed;
    route.travelTime = createRouteDto.travelTime;
    route.route = createRouteDto.route;
    route.deliveryAdress = createRouteDto.deliveryAdress;
    route.coords = {
      lat: createRouteDto.coords.lat,
      lng: createRouteDto.coords.lng,
    };
    route.startCoords = {
      lat: createRouteDto.startCoords.lat,
      lng: createRouteDto.startCoords.lng,
    };
    
    return this.routesRepository.save(route);
  }

  async change(id: number, changeRouteDto: ChangeRouteDto): Promise<Route> {
    if (id != changeRouteDto.id) {
      throw new BadRequestException();
    }

    const route = await this.findOne(id);
    if (changeRouteDto.route) {
      route.route = changeRouteDto.route;
    }

    if (changeRouteDto.speed) {
      route.speed = changeRouteDto.speed;
    }

    if (changeRouteDto.distance) {
      route.distance = changeRouteDto.distance;
    }

    if (changeRouteDto.startCoords) {
      route.startCoords = changeRouteDto.startCoords;
    }

    if (changeRouteDto.travelTime) {
      route.travelTime = changeRouteDto.travelTime;
    }

    if (changeRouteDto.coords) {
      route.coords = changeRouteDto.coords;
    }

    if (changeRouteDto.deliveryAdress) {
      route.deliveryAdress = changeRouteDto.deliveryAdress;
    }

    return this.routesRepository.save(route);
  }

  async findAll(): Promise<Route[]> {
    return this.routesRepository.find();
  }

  async findOne(id: number): Promise<Route> {
    return this.routesRepository.findOneOrFail(id);
  }
}
