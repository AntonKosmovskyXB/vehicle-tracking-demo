import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { MulterModule } from "@nestjs/platform-express";
import { APP_FILTER } from "@nestjs/core";

import { EntityNotFoundExceptionFilter } from "./filters/entity-not-found-exception.filter";

import { User } from "./entities/user.entity";
import { Company } from "./entities/company.entity";
import { Car } from "./entities/car.entity";
import { Track } from "./entities/track.entity";
import { Route } from "./entities/route.entity";
import { Attachment } from "./entities/attachment.entity";

import { UsersService } from "./services/users.service";
import { CompaniesService } from "./services/companies.service";
import { CarsService } from "./services/cars.service";
import { TracksService } from "./services/tracks.service";
import { RoutesService } from "./services/routes.service";
import { AttachmentsService } from "./services/attachments.service";
import { MulterConfigService } from "./services/multer-config.service";

import { UsersController } from "./controllers/users.controller";
import { CompaniesController } from "./controllers/companies.controller";
import { CarsController } from "./controllers/cars.controller";
import { TracksController } from "./controllers/tracks.controller";
import { RoutesController } from "./controllers/routes.controller";
import { AttachmentsController } from "./controllers/attachments.controller";

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Company]),
    TypeOrmModule.forFeature([Car]),
    TypeOrmModule.forFeature([Track]),
    TypeOrmModule.forFeature([Route]),
    TypeOrmModule.forFeature([Attachment]),
    AuthModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [
    UsersController,
    CompaniesController,
    CarsController,
    TracksController,
    RoutesController,
    AttachmentsController,
  ],
  providers: [
    UsersService,
    CompaniesService,
    CarsService,
    TracksService,
    RoutesService,
    AttachmentsService,
    {
      provide: APP_FILTER,
      useClass: EntityNotFoundExceptionFilter,
    },
  ],
})
export class AppModule {}
