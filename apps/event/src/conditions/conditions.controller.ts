import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ConditionDefinition,
  ConditionDefinitionDocument,
} from './schemas/condition-definition.schema';

@Controller('event/conditions')
export class ConditionsController {
  constructor(
    @InjectModel(ConditionDefinition.name)
    private readonly conditionModel: Model<ConditionDefinitionDocument>,
  ) {}

  // 설정가능한 조건 목록 검색
  @Get()
  async findAll() {
    return this.conditionModel.find().select('key description -_id');
  }
}
