import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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

