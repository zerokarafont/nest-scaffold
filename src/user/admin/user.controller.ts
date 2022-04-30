import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/user.dto';
import { SessionAuthGuard } from 'src/auth';
import { ExceptionResponse, SuccessResponse } from 'src/common';
import { User } from '../entities/user.entity';

@ApiTags('user')
@ApiExtraModels(User, SuccessResponse)
@ApiCookieAuth()
@UseGuards(SessionAuthGuard)
@Controller('user')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '创建用户' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(SuccessResponse) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(User),
            },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({ type: ExceptionResponse })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: '查询单个用户' })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(SuccessResponse) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(User),
            },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({ type: ExceptionResponse })
  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }
}
