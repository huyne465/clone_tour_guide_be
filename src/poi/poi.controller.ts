import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PoiService } from './poi.service';
import { CreatePoiDto } from './dto/create-poi.dto';
import { UpdatePoiDto } from './dto/update-poi.dto';

@Controller('pois')
export class PoiController {
  constructor(private readonly poiService: PoiService) {}

  @Post()
  create(@Body() createPoiDto: CreatePoiDto) {
    return this.poiService.create(createPoiDto);
  }

  @Post('upload-audio')
  @UseInterceptors(FileInterceptor('file'))
  uploadAudio(@UploadedFile() file: Express.Multer.File) {
    return this.poiService.uploadAudio(file);
  }

  @Get()
  findAll(@Query('floorId') floorId?: string) {
    return this.poiService.findAll(floorId);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.poiService.findByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poiService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePoiDto: UpdatePoiDto) {
    return this.poiService.update(id, updatePoiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poiService.remove(id);
  }
}
