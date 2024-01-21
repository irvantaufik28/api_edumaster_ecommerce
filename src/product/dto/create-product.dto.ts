import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId({ message: 'category_id should be a valid MongoDB ObjectId' })
  category_id: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  @IsMongoId({
    each: true,
    message: 'Each item in the array should be a valid MongoDB ObjectId',
  })
  productImages: string[];
}
