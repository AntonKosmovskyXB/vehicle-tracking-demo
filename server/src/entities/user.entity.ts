import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne } from "typeorm";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Company } from "./company.entity";
import { UserRole } from "src/enums/user-role.enum";
import { Car } from "./car.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ select: false })
  @IsNotEmpty()
  password: string;

  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;

  @Column()
  @IsNotEmpty()
  phoneNumber: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.Driver,
  })
  role: UserRole;

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  @OneToOne(() => Car, (car) => car.user)
  car: Car;
}
