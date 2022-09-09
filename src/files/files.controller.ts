import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileUploadStorage } from 'src/utils/file-upload.utils';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('avatar/:id')
  @UseGuards(JwtAuthGuard)
  seeUploadedFile(@Param('id') id, @Res() res) {
    return this.filesService.getAvatar(id, res);
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { ...FileUploadStorage }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ) {
    return this.filesService.uploadAvatar(file, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.filesService.remove(id);
  }
}
