import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from 'src/config';
import { UserService } from 'src/user/services/user.service';
import * as crypto from 'crypto';
import { SALT } from 'src/constants';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user';
import { SignatureDto } from './dto/signature.dto';
import { SiweMessage } from 'siwe';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOneWithPass({ username });
    if (!user) {
      throw new BadRequestException(`用户${username}不存在`);
    }

    const salt = this.configService.get(SALT);
    const hash = crypto.createHash('sha256');
    hash.update(`${pass}${salt}`);
    const cryptoPass = hash.digest('hex');
    if (cryptoPass === user.password) {
      return user;
    }
    return null;
  }

  async loginForApp(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginForAdmin(req: any) {
    /**
     * @function req.session.save
     * @description
     * Save the session back to the store, replacing the contents on the store with the contents in memory (though a store may do something else--consult the store's documentation for exact behavior).
     * This method is automatically called at the end of the HTTP response if the session data has been altered (though this behavior can be altered with various options in the middleware constructor).
     * Because of this, typically this method does not need to be called.
     */
    // 保存用户信息到session, 只需要更改req.session对象, express-session中间件会自动保存
    req.session.user = {
      userid: req.user.id,
      name: req.user.username,
    };

    return {
      status: 'ok',
      type: 'account',
      currentAuthority: 'admin',
    };
  }

  async loginForWallet(payload: SignatureDto, session: Record<string, any>) {
    const { message, signature } = payload;
    const siweMessage = new SiweMessage(message);
    try {
      const fields = await siweMessage.validate(signature);

      if (fields.nonce !== session.nonce) {
        throw new UnprocessableEntityException('非法的nonce值');
      }
      session.wallet = fields.address;

      return 'success';
    } catch (e) {
      session.wallet = null;
      session.nonce = null;
      throw new UnprocessableEntityException('签名验证失败');
    }
  }

  async register(user: CreateUserDto) {
    return this.userService.create(user);
  }
}
