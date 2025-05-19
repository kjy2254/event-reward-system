import { Role, Roles } from '@app/common';
import { HttpService } from '@nestjs/axios';
import {
  All,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

// 요청 경로 확인 후 각 서버로 라우팅
@Controller()
export class GatewayController {
  constructor(private readonly http: HttpService) {}

  // 로그인/회원가입 프록시(누구나 접근 가능)
  @All('auth/*')
  async proxyAuth(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, `http://auth:3000${req.originalUrl}`);
  }

  // 이벤트 등록 프록시(OPERATOR, ADMIN 접근 가능)
  @Post('event/events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  async proxyEventCreate(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, `http://event:3000${req.originalUrl}`);
  }

  // 이벤트 조회 프록시(누구나 접근 가능)
  @Get('event/events')
  async proxyEventList(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, `http://event:3000${req.originalUrl}`);
  }

  // 이벤트 보상 등록 프록시(OPERATOR, ADMIN 접근 가능)
  @Post('event/rewards')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  async proxyRewardCreate(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, `http://event:3000${req.originalUrl}`);
  }

  // 이벤트 보상 조회 프록시(누구나 접근 가능)
  @Get('event/rewards')
  async proxyRewardList(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, `http://event:3000${req.originalUrl}`);
  }

  // 이벤트 완료 조건 조회 프록시(OPERATOR, ADMIN 접근 가능)
  @Get('event/conditions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  async proxyConditions(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, `http://event:3000${req.originalUrl}`);
  }

  // 보상 요청 프록시(USER, ADMIN 접근 가능)
  @Post('event/requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async proxyRewardRequest(@Req() req, @Res() res: Response) {
    return this.forward(req, res, `http://event:3000${req.originalUrl}`);
  }

  // 자신의 보상 요청 기록 조회 프록시(USER, ADMIN 접근 가능)
  @Get('event/requests/me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async proxyMyRequests(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, `http://event:3000${req.originalUrl}`);
  }

  // 모든 보상 요청 기록 조회 프록시(OPERATOR, AUDITOR, ADMIN 접근 가능)
  @Get('event/requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.AUDITOR, Role.ADMIN)
  async proxyAllRequests(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, `http://event:3000${req.originalUrl}`);
  }

  // 헤더에 사용자 정보 추가하여 포워딩
  private async forward(req: Request, res: Response, targetUrl: string) {
    const headers = { ...req.headers };

    if ((req.user as any)?.userId) {
      headers['x-user-id'] = (req.user as any).userId;
    }
    delete headers['host'];
    delete headers['content-length'];
    delete headers['connection'];

    try {
      const {
        data,
        status,
        headers: respHeaders,
      } = await lastValueFrom(
        this.http.request({
          method: req.method,
          url: targetUrl,
          data: req.body,
          params: req.query,
          headers,
        }),
      );
      res.set(respHeaders);
      res.status(status).send(data);
    } catch (e) {
      res
        .status(e?.response?.status || 500)
        .json(e?.response?.data || { message: 'Proxy error' });
    }
  }
}
