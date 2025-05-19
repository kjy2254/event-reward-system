// src/requests/dto/find-my-requests.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindMyRequestsDto {
  @ApiPropertyOptional({ description: '필터링할 이벤트 ID' })
  @IsOptional()
  @IsString()
  eventId?: string;

  @ApiPropertyOptional({
    description:
      '보상 상태 필터링 (예: REWARDED, ALREADY_REWARDED, CONDITION_NOT_MET, EVENT_NOT_ACTIVE)',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
