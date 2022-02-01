import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Route } from "src/entities/route.entity";
import { CreateRouteDto } from "src/dto/create-route.dto";

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

  findAll(): Promise<Route[]> {
    return this.routesRepository.find();
  }

  findOne(id: string): Promise<Route> {
    return this.routesRepository.findOneOrFail(id);
  }
}
