import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RewardsService } from './rewards.service';

@Controller('event/rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  // 특정 이벤트의 보상 등록
  @ApiBearerAuth()
  @Post()
  create(@Body() dto: CreateRewardDto) {
    return this.rewardsService.create(dto);
  }

  // 특정 이벤트의 보상 검색
  @Get()
  async findByEvent(@Query('eventId') eventId: string) {
    return this.rewardsService.findByEvent(eventId);
  }
}
