import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext, Injectable } from '@nestjs/common';
// import { RealIP } from 'nestjs-real-ip';

/**
 * 如果app在代理服务器后运行，此限流守卫器可以获取真实的用户IP
 * 同时确保express 启用了trust proxy
 * @link https://www.expressjs.com.cn/guide/behind-proxies.html
 */
@Injectable()
class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    return req.ips.length ? req.ips[0] : req.ip;
  }
}

/**
 * 适用于REST请求和反向代理的限流守卫器
 */
export class RestThrottlerBehindProxyGuard extends ThrottlerBehindProxyGuard {
  // protected getTracker(@RealIP() ip: string): string {
  //   return ip;
  // }
}

/**
 * 适用于GRAPHQL请求和反向代理的限流守卫器
 */
@Injectable()
export class GqlThrottlerBehindProxyGuard extends ThrottlerBehindProxyGuard {
  // getRequestResponse(context: ExecutionContext) {
  //   const gqlCtx = GqlExecutionContext.create(context);
  //   const ctx = gqlCtx.getContext();
  //   return { req: ctx.req, res: ctx.res }
  // }
}
