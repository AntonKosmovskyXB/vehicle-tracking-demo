import { Body, Controller, Get, Post, Param, UseGuards, StreamableFile, Response } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { createReadStream } from "fs";
import { join } from "path";

import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserRole } from "src/enums/user-role.enum";

import { Attachment } from "src/entities/attachment.entity";
import { AttachmentsService } from "src/services/attachments.service";

@ApiBearerAuth("JWT-auth")
@ApiTags("attachments")
@Controller("attachments")
@UseGuards(JwtAuthGuard)
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Get(":id")
  @Roles(UserRole.Admin)
  async findOne(@Param("id") id: string, @Response({ passthrough: true }) res): Promise<StreamableFile> {
    const attachment = await this.attachmentsService.findOne(id);

    const file = createReadStream(join(process.cwd(), "attachments", attachment.file_name));
    res.set({
      "Content-Type": attachment.mime_type,
      "Content-Disposition": `inline; filename="${attachment.original_name}"`,
    });

    return new StreamableFile(file);
  }
}
