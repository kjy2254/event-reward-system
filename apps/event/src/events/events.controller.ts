import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';

@Controller('event')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // 이벤트 등록
  @Post('events')
  create(@Body() dto: CreateEventDto, @Request() req) {
    return this.eventsService.create(dto);
  }

  // 이벤트 조회
  @Get('events')
  async findAll() {
    return this.eventsService.findAll();
  }
}
