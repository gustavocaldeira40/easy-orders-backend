import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { FilesEntity } from 'src/entities/files.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesEntity)
    private repository: Repository<FilesEntity>,

    private readonly user_service: UsersService,
  ) {}

  async createAvatar(id: number, file: Express.Multer.File) {
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

    return files;
  }

  async getAvatar(fileName, res) {
    const file = await this.repository.findOne({
      where: { fileName: fileName, isActive: true },
      order: { createdAt: 'DESC' },
    });

    if (file === null) {
      return res.send("Don't have photo of user");
    }

    return res.sendFile(file?.fileName, {
      root: join(__dirname, '../../', 'uploads'),
    });
  }

  async update(id: number, file) {
    const oldAvatar = await this.repository.findOne({ where: { userId: id } });

    oldAvatar.isActive = false;

    return this.createAvatar(id, file);
  }

  async remove(id: number) {
    const file = await this.repository.findOne({
      where: { userId: id, isActive: true },
    });

    if (!file) {
      throw new HttpException('User Not Found !', HttpStatus.NOT_FOUND);
    }

    file.isActive = false;

    await this.repository.save(file);

    return 'Sucessfully';
  }
}
