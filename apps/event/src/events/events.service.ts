import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConditionDefinition } from '../conditions/schemas/condition-definition.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(ConditionDefinition.name)
    private readonly conditionModel: Model<ConditionDefinition>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    await this.validateConditions(createEventDto.conditions);

    const existing = await this.eventModel.findOne({
      title: createEventDto.title,
    });
    if (existing) {
      throw new ConflictException('이미 동일한 제목의 이벤트가 존재합니다.');
    }
    return this.eventModel.create(createEventDto);
  }

  private async validateConditions(keys: string[]): Promise<void> {
    const validKeys = await this.conditionModel.find().distinct('key');

    for (const key of keys) {
      if (!validKeys.includes(key)) {
        throw new BadRequestException(`존재하지 않은 조건 key 입니다: ${key}`);
      }
    }
  }

  async findAll() {
    const events = await this.eventModel.find().lean();

    const now = new Date();

    return events.map((event) => ({
      ...event,
      status:
        now >= new Date(event.startDate) && now <= new Date(event.endDate)
          ? 'ACTIVE'
          : 'INACTIVE',
    }));
  }
}
