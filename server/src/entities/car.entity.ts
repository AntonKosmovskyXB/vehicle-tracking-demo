import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Track } from "./track.entity";
import { User } from "./user.entity";

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

  @OneToOne(() => User, (user) => user.car)
  @JoinColumn()
  user: User;
}
