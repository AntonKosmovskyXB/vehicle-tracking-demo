import { Injectable } from "@nestjs/common";
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from "@nestjs/platform-express";
import { extname } from "path";
import { diskStorage } from "multer";
import { Request } from "express";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): Promise<MulterModuleOptions> | MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: "./attachments",
        filename: (
          req: Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void
        ) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join("");
          return callback(
            null,
            `${randomName}${extname(file.originalname).toLowerCase()}`
          );
        },
      }),
    };
  }
}
