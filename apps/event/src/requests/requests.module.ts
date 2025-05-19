import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConditionCheckerService } from '../conditions/condition-checker.service';
import { Event, EventSchema } from '../events/schemas/event.schema';
import {
  LoginRecord,
  LoginRecordSchema,
} from '../records/schemas/login-record.schema';
import {
  QuestRecord,
  QuestRecordSchema,
} from '../records/schemas/quest-record.schema';
import { Reward, RewardSchema } from '../rewards/schemas/reward.schema';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { RequestSchema, RewardRequest } from './schemas/request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RequestSchema },
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: LoginRecord.name, schema: LoginRecordSchema },
      { name: QuestRecord.name, schema: QuestRecordSchema },
    ]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService, ConditionCheckerService],
})
export class RequestsModule {}
