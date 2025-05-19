import { HttpService } from '@nestjs/axios';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';

@Controller('docs')
export class SwaggerProxyController {
  constructor(private readonly httpService: HttpService) {}

  @Get('auth/*')
  async proxyAuthDocs(@Req() req: Request, @Res() res: Response) {
    const subPath = req.url.replace('/docs/auth', '');
    const targetUrl = `http://auth:3000/docs/auth${subPath}`;

    const response = await lastValueFrom(
      this.httpService.get(targetUrl, {
        responseType: 'arraybuffer',
      }),
    );

    const contentType = response.headers['content-type'] ?? 'text/html';
    res.setHeader('Content-Type', contentType);
    res.send(response.data);
  }

  @Get('event/*')
  async proxyEventDocs(@Req() req: Request, @Res() res: Response) {
    const subPath = req.url.replace('/docs/event', '');
    const targetUrl = `http://event:3000/docs/event${subPath}`;

    const response = await lastValueFrom(
      this.httpService.get(targetUrl, {
        responseType: 'arraybuffer',
      }),
    );

    const contentType = response.headers['content-type'] ?? 'text/html';
    res.setHeader('Content-Type', contentType);
    res.send(response.data);
  }
}
