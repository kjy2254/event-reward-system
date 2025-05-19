import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    // 이벤트 존재 검사
    const event = await this.eventModel.findById(dto.eventId);
    if (!event) {
      throw new NotFoundException('해당 이벤트가 존재하지 않습니다.');
    }

    // 이벤트 내 중복 보상 확인
    const existing = await this.rewardModel.findOne({
      eventId: dto.eventId,
      name: dto.name,
    });
    if (existing) {
      throw new ConflictException('이미 동일한 이름의 보상이 존재합니다.');
    }

    return this.rewardModel.create(dto);
  }

  async findByEvent(eventId: string): Promise<Reward[]> {
    return this.rewardModel.find({ eventId }).exec();
  }
}
