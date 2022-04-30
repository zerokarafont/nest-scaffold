import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Session,
} from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user';
import { AuthService } from './auth.service';
import { SessionAuthGuard } from './guards';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Admin登录' })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: CreateUserDto })
  @Post('login/account')
  async loginAccount(@Request() req) {
    return this.authService.loginForAdmin(req);
  }

  @ApiOperation({ summary: '前端登录' })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: CreateUserDto })
  @Post('login/app')
  async loginApp(@Request() req) {
    return this.authService.loginForApp(req.user);
  }

  @ApiOperation({ summary: '注册' })
  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @ApiOperation({ summary: '获取当前用户' })
  @ApiCookieAuth()
  @UseGuards(SessionAuthGuard)
  @Get('/currentUser')
  async currentUser(@Session() session: Record<string, any>) {
    return session.user;
  }
}
