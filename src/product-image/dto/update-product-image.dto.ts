import { IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
export class UpdateProductImageDto {
  @IsBoolean()
  @IsOptional()
  is_main_image: boolean;

  @IsNotEmpty()
  @IsOptional()
  image_url: string;
}
