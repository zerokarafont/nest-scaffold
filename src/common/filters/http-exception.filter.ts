import { Catch, HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

/** 请求异常响应 */
export class ExceptionResponse {
  @ApiProperty({
    description: 'HTTP状态码',
    examples: [400, 401],
    default: 400,
  })
  statusCode: number;
  @ApiProperty({ description: '异常信息' })
  msg: string;
  @ApiProperty({ description: '返回数据', default: null, type: 'null' })
  data: never;
  @ApiProperty({ description: '请求时间' })
  timestamp: string;
  @ApiProperty({ description: '请求路径' })
  path: string;
}

@Catch(HttpException)
export class HttpExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.status;
    let message;

    if (exception.response) {
      if (Array.isArray(exception.response.message)) {
        message = exception.response.message[0];
      } else {
        message = exception.response.message;
      }
    } else {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      msg: message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
