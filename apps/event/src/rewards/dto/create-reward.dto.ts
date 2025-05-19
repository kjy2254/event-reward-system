import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRewardDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  quantity: number;

  @IsMongoId()
  eventId: string;
}
