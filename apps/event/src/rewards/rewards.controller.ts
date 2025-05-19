import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RewardsService } from './rewards.service';

@Controller('event/rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  create(@Body() dto: CreateRewardDto) {
    return this.rewardsService.create(dto);
  }

  @Get()
  async findByEvent(@Query('eventId') eventId: string) {
    return this.rewardsService.findByEvent(eventId);
  }
}
