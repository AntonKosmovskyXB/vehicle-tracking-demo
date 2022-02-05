import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Car } from "./car.entity";
import { Route } from "./route.entity";

@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  type: string;

  @Column()
  @IsNotEmpty()
  model: string;

  @Column({ unique: true })
  @IsNotEmpty()
  serial_number: string;

  @OneToOne(() => Car, (car) => car.track)
  car: Car;

  @OneToOne(() => Route, (route) => route.track)
  route: Route;
}
