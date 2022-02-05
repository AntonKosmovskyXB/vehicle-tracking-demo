import { Body, Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserRole } from "src/enums/user-role.enum";

import { Company } from "src/entities/company.entity";
import { CreateCompanyDto } from "src/dto/create-company.dto";
import { CompaniesService } from "src/services/companies.service";

@ApiBearerAuth("JWT-auth")
@ApiTags("companies")
@Controller("companies")
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(UserRole.Admin)
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @Roles(UserRole.Admin)
  async findAll(): Promise<Company[]> {
    return this.companiesService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.Admin)
  async findOne(@Param("id") id: number): Promise<Company> {
    return this.companiesService.findOne(id);
  }
}
