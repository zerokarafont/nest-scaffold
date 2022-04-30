import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** 请求成功响应 */
export class SuccessResponse<T> {
  @ApiProperty({
    description: 'HTTP状态码',
    examples: [200, 201],
    default: 200,
  })
  statusCode: number;
  @ApiProperty({ description: '返回信息', default: 'ok' })
  msg: 'ok';

  data: T;
  @ApiProperty({ description: '请求时间' })
  timestamp: string;
  @ApiProperty({ description: '请求路径' })
  path: string;
}

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    response.status(200);

    return next.handle().pipe(
      map((data) => ({
        statusCode: statusCode,
        msg: 'ok',
        data: data,
        timestamp: new Date().toISOString(),
        path: request.url,
      })),
    );
  }
}
