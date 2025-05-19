import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConditionCheckerService } from '../conditions/condition-checker.service';
import { Event, EventDocument } from '../events/schemas/event.schema';
import { Reward, RewardDocument } from '../rewards/schemas/reward.schema';
import { CreateRequestDto } from './dto/create-request.dto';
import { RewardRequest, RewardRequestDocument } from './schemas/request.schema';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(RewardRequest.name)
    private readonly requestModel: Model<RewardRequestDocument>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
    @InjectModel(Reward.name)
    private readonly rewardModel: Model<RewardDocument>,
    private readonly conditionChecker: ConditionCheckerService,
  ) {}

  async create(dto: CreateRequestDto, userId: string): Promise<RewardRequest> {
    // 이벤트 존재 검사
    const event = await this.eventModel.findById(dto.eventId);
    if (!event) throw new NotFoundException('이벤트가 존재하지 않습니다.');

    // 현재 시간이 이벤트 기간 내인지 확인
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (now < start || now > end) {
      return this.requestModel.create({
        userId,
        eventId: dto.eventId,
        status: 'EVENT_NOT_ACTIVE',
      });
    }

    // 보상 중복 수령 검사
    const rewarded = await this.requestModel.findOne({
      userId,
      eventId: dto.eventId,
      status: 'REWARDED',
    });
    if (rewarded) {
      return this.requestModel.create({
        userId,
        eventId: dto.eventId,
        status: 'ALREADY_REWARDED',
      });
    }

    // 보상 수령 조건 충족 검사
    for (const key of event.conditions) {
      const ok = await this.conditionChecker.check(userId, key);
      if (!ok) {
        return this.requestModel.create({
          userId,
          eventId: dto.eventId,
          status: 'CONDITION_NOT_MET',
        });
      }
    }

    // 모든 조건 통과시 보상 지급
    const result = await this.requestModel.create({
      userId,
      eventId: dto.eventId,
      status: 'REWARDED',
    });

    const rewards = await this.rewardModel.find({ eventId: dto.eventId });

    return {
      ...result.toObject(),
      rewards: rewards.map((r) => ({
        name: r.name,
        type: r.type,
        quantity: r.quantity,
      })),
    } as any;
  }

  async findUserRequests(userId: string, eventId?: string, status?: string) {
    const filter: any = { userId };
    if (eventId) filter.eventId = eventId;
    if (status) filter.status = status;

    return this.requestModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findAllRequests(eventId?: string, status?: string) {
    const filter: any = {};
    if (eventId) filter.eventId = eventId;
    if (status) filter.status = status;

    return this.requestModel.find(filter).sort({ createdAt: -1 }).exec();
  }
}
