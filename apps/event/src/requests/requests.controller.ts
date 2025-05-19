import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestsService } from './requests.service';

@Controller('event/requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  async create(@Body() dto: CreateRequestDto, @Req() req) {
    const userId = req.headers['x-user-id'];
    return this.requestsService.create(dto, userId);
  }
}
