export class CreatePoiDto {
  code: string;
  title: string;
  description?: string;
  audio_url: string;
  duration: number;
  image_url?: string;
  position_x?: number;
  position_y?: number;
  floor_id: string;
}

