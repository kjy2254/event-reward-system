import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from '../events/schemas/event.schema';
import { CreateRewardDto } from './dto/create-reward.dto';
import { Reward, RewardDocument } from './schemas/reward.schema';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<RewardDocument>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,
  ) {}

  async create(dto: CreateRewardDto): Promise<Reward> {
    const event = await this.eventModel.findById(dto.eventId);
    if (!event) {
      throw new NotFoundException('해당 이벤트가 존재하지 않습니다.');
    }

    return this.rewardModel.create(dto);
  }

  async findByEvent(eventId: string): Promise<Reward[]> {
    return this.rewardModel.find({ eventId }).exec();
  }
}
