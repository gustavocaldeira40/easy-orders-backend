import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { ...FileUploadStorage }))
  async createAvatar(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.filesService.createAvatar(id, file);
  }

  @Get('avatar/:fileName')
  // @UseGuards(JwtAuthGuard)
  seeUploadedFile(@Param('fileName') fileName, @Res() res) {
    return this.filesService.getAvatar(fileName, res);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { ...FileUploadStorage }))
  update(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return this.filesService.update(id, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    return this.filesService.remove(id);
  }
}
