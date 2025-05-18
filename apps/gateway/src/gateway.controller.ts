import { JwtAuthGuard, Role, Roles, RolesGuard } from '@app/common';
import { HttpService } from '@nestjs/axios';
import { All, Controller, Req, Res, UseGuards } from '@nestjs/common';
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

  @All('event/*')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.OPERATOR, Role.AUDITOR, Role.ADMIN)
  async proxyEvent(@Req() req: Request, @Res() res: Response) {
    const targetUrl = `http://event:3000${req.originalUrl}`;
    return this.forward(req, res, targetUrl);
  }

  private async forward(req: Request, res: Response, targetUrl: string) {
    const headers = { ...req.headers };
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
