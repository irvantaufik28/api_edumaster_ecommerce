import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @IsMongoId({ message: 'category_id should be a valid MongoDB ObjectId' })
  category_id?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  @IsMongoId({
    each: true,
    message: 'Each item in the array should be a valid MongoDB ObjectId',
  })
  product_images?: string[];
}
