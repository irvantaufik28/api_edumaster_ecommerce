import { IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
export class CreateProductImageDto {
  @IsBoolean()
  @IsOptional()
  is_main_image: boolean;

  @IsNotEmpty()
  image_url: string;
}
