import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Track } from "./track.entity";

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  model: string;

  @Column({ unique: true })
  @IsNotEmpty()
  state_number: string;

  @OneToOne(() => Track, (track) => track.car)
  @JoinColumn()
  track: Track;
}
