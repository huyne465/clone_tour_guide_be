import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import * as mm from 'music-metadata';
import { CreatePoiDto } from './dto/create-poi.dto';
import { UpdatePoiDto } from './dto/update-poi.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PoiService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createPoiDto: CreatePoiDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('pois')
      .insert([createPoiDto])
      .select();

    if (error) throw new InternalServerErrorException(error.message);
    return data[0];
  }

  async uploadAudio(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is missing');

    let duration = 0;
    try {
      const metadata = await mm.parseBuffer(file.buffer, file.mimetype);
      duration = Math.floor(metadata.format.duration || 0);
    } catch (e) {
      throw new InternalServerErrorException('Error parsing audio duration: ' + e.message);
    }

    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.round(Math.random() * 10E5)}.${fileExt}`;
    const { data, error } = await this.supabaseService.getClient()
      .storage
      .from('pois-audio')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException('Failed to upload file: ' + error.message);
    }

    const { data: publicUrlData } = this.supabaseService.getClient()
      .storage
      .from('pois-audio')
      .getPublicUrl(fileName);

    return {
      audio_url: publicUrlData.publicUrl,
      duration: duration,
    };
  }

  async findAll(floorId?: string) {
    let query = this.supabaseService.getClient().from('pois').select('*');
    if (floorId) {
      query = query.eq('floor_id', floorId);
    }
    const { data, error } = await query;

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('pois')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException('POI not found');
    return data;
  }

  async findByCode(code: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('pois')
      .select('*')
      .eq('code', code)
      .single();

    if (error) throw new NotFoundException('POI not found with given code');
    return data;
  }

  async update(id: string, updatePoiDto: UpdatePoiDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('pois')
      .update(updatePoiDto)
      .eq('id', id)
      .select();

    if (error) throw new InternalServerErrorException(error.message);
    if (!data || data.length === 0) throw new NotFoundException('POI not found');
    return data[0];
  }

  async remove(id: string) {
    const { error } = await this.supabaseService
      .getClient()
      .from('pois')
      .delete()
      .eq('id', id);

    if (error) throw new InternalServerErrorException(error.message);
    return { deleted: true };
  }
}

