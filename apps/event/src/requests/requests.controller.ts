import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
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

  // 본인 요청 조회
  @Get('me')
  findMyRequests(
    @Req() req,
    @Query('eventId') eventId?: string,
    @Query('status') status?: string,
  ) {
    const userId = req.headers['x-user-id'];
    return this.requestsService.findUserRequests(userId, eventId, status);
  }

  // 전체 요청 조회
  @Get()
  findAllRequests(
    @Query('eventId') eventId?: string,
    @Query('status') status?: string,
  ) {
    return this.requestsService.findAllRequests(eventId, status);
  }
}
