import { JwtAuthGuard, Role, Roles, RolesGuard } from '@app/common';
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

@Controller()
export class GatewayController {
  constructor(private readonly http: HttpService) {}

  @All('auth/*') // 인증 없이 Auth로 프록시
  async proxyAuth(@Req() req: Request, @Res() res: Response) {
    const targetUrl = `http://auth:3000${req.originalUrl}`;
    return this.forward(req, res, targetUrl);
  }

  @Post('event/events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  async proxyEventCreate(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, `http://event:3000${req.originalUrl}`);
  }

  @Get('event/events')
  async proxyEventList(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, `http://event:3000${req.originalUrl}`);
  }

  @Post('event/rewards')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  async proxyRewardCreate(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, `http://event:3000${req.originalUrl}`);
  }

  @Get('event/rewards')
  async proxyRewardList(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, `http://event:3000${req.originalUrl}`);
  }

  @Get('event/conditions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OPERATOR, Role.ADMIN)
  async proxyConditions(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, `http://event:3000${req.originalUrl}`);
  }

  @Post('event/requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async proxyRewardRequest(@Req() req, @Res() res: Response) {
    return this.forward(req, res, `http://event:3000${req.originalUrl}`);
  }

  private async forward(req: Request, res: Response, targetUrl: string) {
    const headers = { ...req.headers };
    // 수정예정
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
