import { Module } from "@nestjs/common";
import { FilteUploadService } from "./file-upload.service";
import { CloudinaryProvider } from "./cloudinary.provider";

@Module({
    providers: [FilteUploadService, CloudinaryProvider ],
    exports: [FilteUploadService, CloudinaryProvider]
})

export class FileUploadModule{}