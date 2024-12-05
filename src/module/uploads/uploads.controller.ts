import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
  Get,
  Param,
  Query,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateUploadDto } from './uploads.dto';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UseQueryFilter } from '@/common/decorators/limit-offset.decorator';

@ApiTags('uploads')
@ApiBearerAuth()
@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadsService: UploadsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiQuery({
    name: 'fileName',
    required: false,
    description: 'File name',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          const folder = ext.split('.')[1];
          const destinationFolder = `./uploads/${file.mimetype}/${new Date().toLocaleDateString()}`;

          // Check if the destination folder exists, if not, create it
          if (!fs.existsSync(destinationFolder)) {
            fs.mkdirSync(destinationFolder, { recursive: true });
          }

          cb(null, destinationFolder); // Destination folder where uploaded files will be stored
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('fileName') fileName: string,
    @Req() request,
  ) {
    const userId = request.user.userId;
    // Generate URL for the uploaded file
    const uploadedFilePath = `${file.destination.split('.')[1]}/${file.filename}`; // Assuming uploads folder is served statically
    const fileUrl = `${request.protocol}://${request.get('host')}${uploadedFilePath}`;

    // Create an upload record
    const createUploadDto: CreateUploadDto = {
      url: fileUrl,
      destination: file.destination,
      name: fileName ?? file.filename,
      size: file.size,
      type: file.mimetype,
      userId,
    };

    const upload = await this.uploadsService.create(createUploadDto);

    return { ...upload }; // Return the URL of the uploaded file
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchFile(@Query('name') name: string, @Req() request) {
    const userId = request.user.userId;
    const uploads = await this.uploadsService.seachQueryFile(name, userId);
    if (!uploads || uploads.length === 0) {
      throw new NotFoundException('پیدا نشد');
    }
    return uploads;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number, @Req() request) {
    const userId = request.user.userId;
    const upload = await this.uploadsService.findOne(id, userId);
    if (!upload) {
      throw new NotFoundException('پیدا نشد');
    }
    return upload;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @UseQueryFilter()
  async findAll(@Req() request) {
    const userId = request.user.userId;
    return this.uploadsService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() request) {
    const userId = request.user.userId;
    await this.uploadsService.remove(id, userId);
    return { message: 'آپلود با موفقیت حذف شد' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('type/:type')
  @UseQueryFilter()
  async findByType(@Param('type') type: string, @Req() request) {
    const userId = request.user.userId;
    const upload = await this.uploadsService.findByType(type, userId);
    if (!upload) {
      throw new NotFoundException('پیدا نشد');
    }
    return upload;
  }
}
