import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeleteResult } from "typeorm";

import { Attachment } from "src/entities/attachment.entity";

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentsRepository: Repository<Attachment>
  ) {}

  async create(file: Express.Multer.File): Promise<Attachment> {
    const attachment = new Attachment();
    attachment.file_name = file.filename;
    attachment.mime_type = file.mimetype;
    attachment.original_name = file.originalname;
    return this.attachmentsRepository.save(attachment);
  }

  findOne(id: string): Promise<Attachment> {
    return this.attachmentsRepository.findOneOrFail(id);
  }

  remove(id: string): Promise<DeleteResult> {
    return this.attachmentsRepository.delete(id);
  }
}
