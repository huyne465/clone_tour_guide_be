import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { FloorService } from './floor.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import type { Response } from 'express';
import * as https from 'https';
import * as http from 'http';

@Controller('floors')
export class FloorController {
  constructor(private readonly floorService: FloorService) {}

  @Post()
  create(@Body() createFloorDto: CreateFloorDto) {
    return this.floorService.create(createFloorDto);
  }

  @Get()
  findAll() {
    return this.floorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.floorService.findOne(id);
  }

  @Get(':id/map-image')
  async getMapImage(@Param('id') id: string, @Res() res: Response) {
    const floor = await this.floorService.findOne(id);
    if (!floor.map_image_url) {
      return res.status(404).send('No map image for this floor');
    }
    const url = floor.map_image_url;
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (imgRes) => {
      res.setHeader('Content-Type', imgRes.headers['content-type'] || 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      imgRes.pipe(res);
    }).on('error', () => {
      res.status(500).send('Failed to fetch map image');
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFloorDto: UpdateFloorDto) {
    return this.floorService.update(id, updateFloorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.floorService.remove(id);
  }
}

