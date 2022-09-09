import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadStorage } from 'src/utils/file-upload.utils';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':nameFile')
  seeUploadedFile(@Param('nameFile') image, @Res() res) {
    return this.filesService.getAvatar(res, image);
  }

  @Post(':id')
  @UseInterceptors(FileInterceptor('file', { ...FileUploadStorage }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ) {
    return this.filesService.uploadAvatar(file, id);
  }
}
