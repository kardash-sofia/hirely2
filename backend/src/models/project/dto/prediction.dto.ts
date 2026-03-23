import { IsInt, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class PredictProfitDto {
  @IsString()
  @MaxLength(255)
  category: string;

  @IsString()
  @MaxLength(255)
  ship_mode: string;

  @IsString()
  @MaxLength(255)
  state: string;

  @IsNumber()
  @Min(0)
  cost: number;

  @IsInt()
  @Min(1)
  units: number;

  @IsString()
  @MaxLength(255)
  customer_id: string;
}

export class PredictShipDto {
  @IsString()
  @MaxLength(255)
  category: string;

  @IsString()
  @MaxLength(255)
  city: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  units: number;

  @IsNumber()
  @Min(0)
  profit: number;
}
