import { IsInt, IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import 'reflect-metadata';

export class CartResponseDto {
  @IsNotEmpty()
  data: string;
}
