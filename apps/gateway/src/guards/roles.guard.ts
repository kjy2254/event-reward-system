import { Role, ROLES_KEY } from '@app/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// 역할(Role)에 따른 요청 허용 여부를 판단하는 Guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndMerge<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // 요구되는 역할이 없으면 무조건 통과
    if (!requiredRoles || requiredRoles.length === 0) return true;

    // 요청 객체에서 유저 정보 추출 (JwtAuthGuard가 먼저 실행되어 req.user가 세팅되어 있어야 함)
    const { user } = context.switchToHttp().getRequest();

    // 유저의 역할이 요구 역할 목록에 포함되면 통과, 아니면 차단
    return requiredRoles.includes(user?.role);
  }
}
