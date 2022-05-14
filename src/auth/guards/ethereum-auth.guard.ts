import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class EthereumAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const wallet = request.session?.wallet;

    if (!wallet) {
      // 此异常前端捕获可以静默处理，不需要弹出消息提示
      throw new UnauthorizedException('please connect your wallet');
    }

    return true;
  }
}
