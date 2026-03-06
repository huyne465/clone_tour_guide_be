import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class FloorService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createFloorDto: CreateFloorDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('floors')
      .insert([createFloorDto])
      .select();
      
    if (error) throw new InternalServerErrorException(error.message);
    return data[0];
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('floors')
      .select('*')
      .order('level', { ascending: true });

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('floors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException('Floor not found');
    return data;
  }

  async update(id: string, updateFloorDto: UpdateFloorDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('floors')
      .update(updateFloorDto)
      .eq('id', id)
      .select();

    if (error) throw new InternalServerErrorException(error.message);
    if (!data || data.length === 0) throw new NotFoundException('Floor not found');
    return data[0];
  }

  async remove(id: string) {
    const { error } = await this.supabaseService
      .getClient()
      .from('floors')
      .delete()
      .eq('id', id);

    if (error) throw new InternalServerErrorException(error.message);
    return { deleted: true };
  }
}

