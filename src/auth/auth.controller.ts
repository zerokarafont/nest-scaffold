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
import { generateNonce } from 'siwe';
import { CreateUserDto } from 'src/user';
import { AuthService } from './auth.service';
import { SignatureDto } from './dto/signature.dto';
import { EthereumAuthGuard, SessionAuthGuard } from './guards';
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

  @ApiOperation({ summary: '获取nonce值' })
  @Get('/nonce')
  async nonce(@Session() session: Record<string, any>) {
    const nonce = generateNonce();
    session.nonce = nonce;
    return nonce;
  }

  @ApiOperation({ summary: '获取钱包信息' })
  @UseGuards(EthereumAuthGuard)
  @Get('/web3Profile')
  async web3Profile(@Session() session: Record<string, any>) {
    return session.wallet;
  }

  @ApiOperation({
    summary: '钱包登录 siwe: Sign In with Ethereum',
    description:
      '前端调用/nonce接口获取nonce值然后发送签名给此接口进行验证, 验证成功会将会话状态保存在session中, 可以调用/web3Profile接口获取钱包信息, 这样避免每次刷新页面都有重新链接钱包',
  })
  @Post('/siwe')
  async siwe(
    @Body() payload: SignatureDto,
    @Session() session: Record<string, any>,
  ) {
    return this.authService.loginForWallet(payload, session);
  }
}
