import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LoginRecord,
  LoginRecordSchema,
} from '../records/schemas/login-record.schema';
import {
  QuestRecord,
  QuestRecordSchema,
} from '../records/schemas/quest-record.schema';
import { ConditionCheckerService } from './condition-checker.service';
import { ConditionsController } from './conditions.controller';
import {
  ConditionDefinition,
  ConditionDefinitionSchema,
} from './schemas/condition-definition.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ConditionDefinition.name, schema: ConditionDefinitionSchema },
      { name: LoginRecord.name, schema: LoginRecordSchema },
      { name: QuestRecord.name, schema: QuestRecordSchema },
    ]),
  ],
  controllers: [ConditionsController],
  providers: [ConditionCheckerService],
  exports: [ConditionCheckerService],
})
export class ConditionsModule {}
