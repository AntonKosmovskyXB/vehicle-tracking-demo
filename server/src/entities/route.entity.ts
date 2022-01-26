import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { IsNotEmpty } from "class-validator";

export type Coordinates = { lat: number; lng: number };

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  distance: number;

  @Column()
  speed: number;

  @Column()
  travelTime: number;

  @Column()
  @IsNotEmpty()
  route: string;

  @Column()
  @IsNotEmpty()
  deliveryAdress: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column("simple-json")
  coords: Coordinates;

  @Column("simple-json")
  startCoords: Coordinates;

  @ManyToMany((type) => Route)
  @JoinTable()
  alternatives: Route[];
}
