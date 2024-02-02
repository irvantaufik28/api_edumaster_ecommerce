import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import 'reflect-metadata';

class CartDetailsDto {
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @IsInt()
  @IsNotEmpty()
  qty: number;
}

export class CreateOrUpdateCartDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartDetailsDto)
  cart_details: CartDetailsDto[];
}
