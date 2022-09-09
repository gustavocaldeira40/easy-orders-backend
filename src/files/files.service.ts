import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { FilesEntity } from 'src/entities/files.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesEntity)
    private repository: Repository<FilesEntity>,
  ) {}

  async uploadAvatar(file, id: number) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      throw new HttpException(
        'Only image files are allowed!',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const formData = {
      userId: id,
      fileName: file?.filename,
      typeFile: file?.mimetype,
    };

    const files = await this.repository.save(formData);
    console.log('RESPONSE', files);
    return files;
  }

  async getAvatar(res, image: string) {
    return res.sendFile(image, { root: join(__dirname, '../../', 'uploads') });
  }
}
