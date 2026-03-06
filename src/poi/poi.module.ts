import { Module } from '@nestjs/common';
import { PoiService } from './poi.service';
import { PoiController } from './poi.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [PoiController],
  providers: [PoiService],
})
export class PoiModule {}

