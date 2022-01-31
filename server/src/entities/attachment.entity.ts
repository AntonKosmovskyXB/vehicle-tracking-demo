import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty } from "class-validator";
import { Car } from "./car.entity";

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  file_name: string;

  @Column()
  @IsNotEmpty()
  mime_type: string;

  @Column()
  @IsNotEmpty()
  original_name: string;

  @OneToMany(() => Car, (car) => car.image)
  cars: Car[];
}
