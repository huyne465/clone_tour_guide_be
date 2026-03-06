import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn('SUPABASE_URL or SUPABASE_KEY is missing from environment variables.');
    }

    this.supabase = createClient(
      supabaseUrl || 'http://localhost:8000',
      supabaseKey || 'dummy_key'
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}

