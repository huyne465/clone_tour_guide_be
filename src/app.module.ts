import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { FloorModule } from './floor/floor.module';
import { PoiModule } from './poi/poi.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    FloorModule,
    PoiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
