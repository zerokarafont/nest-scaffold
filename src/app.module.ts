import {
  Module,
  Logger,
  Inject,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import {
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_PORT,
  DB_USER,
  REDIS_HOST,
  REDIS_PORT,
  SESSION_EXPIRES_IN_SECONDS,
  SESSION_NAME,
  SESSION_SECRET,
  THROTTLE_LIMIT,
  THROTTLE_TTL,
} from './constants';
import { UtilsModule } from './utils';
import { ConfigModule, ConfigService } from './config';
import { IRedisOptions, PK_REDIS_OPTIONS, RedisModule } from './redis';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AsyncLocalStorage } from 'async_hooks';
import { EntityManager } from '@mikro-orm/core';
import { AdminUserModule } from './user';
import { FileModule } from './file';
import { AuthModule } from './auth';
import expressSession from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';

const PK_SESSION_OPTIONS = 'pk_session_options';
const logger = new Logger('MikroORM');
export const storage = new AsyncLocalStorage<EntityManager>();
const RedisStore = connectRedis(expressSession);

@Module({
  imports: [
    ConfigModule.register(),
    RedisModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        host: config.get(REDIS_HOST),
        port: +config.get(REDIS_PORT),
      }),
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        debug: process.env.NODE_ENV === 'development',
        type: 'mysql',
        host: config.get(DB_HOST),
        port: +config.get(DB_PORT),
        user: config.get(DB_USER),
        password: config.get(DB_PASS),
        dbName: config.get(DB_NAME),
        entities: ['dist/**/*.entity.js'],
        entitiesTs: ['src/**/*.entity.ts'],
        registerRequestContext: false,
        context: () => storage.getStore(),
        logger: logger.log.bind(logger),
        migrations: {
          path: 'dist/migrations',
          pathTs: 'src/migrations',
        },
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: +config.get(THROTTLE_TTL), // 每个请求将在存储中持续的秒数
        limit: +config.get(THROTTLE_LIMIT), // TTL 限制内的最大请求数
        storage: new ThrottlerStorageRedisService(),
      }),
    }),
    UtilsModule,
    AdminUserModule,
    FileModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: PK_SESSION_OPTIONS,
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get(SESSION_SECRET),
          name: configService.get(SESSION_NAME),
          expiresInSeconds: configService.get(SESSION_EXPIRES_IN_SECONDS),
        };
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule implements NestModule {
  constructor(
    @Inject(PK_REDIS_OPTIONS) private readonly redisOptions: IRedisOptions,
    @Inject(PK_SESSION_OPTIONS) private readonly sessionOptions,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const sessionOptions: any = {
      name: this.sessionOptions.name,
      secret: this.sessionOptions.secret, // 用来对session id相关的cookie进行签名
      saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
      resave: false, // 是否每次都重新保存会话，建议false
      proxy: true,
      cookie: {
        maxAge: this.sessionOptions.expiresInSeconds * 1000, // 有效期，单位是毫秒
        secure: process.env.NODE_ENV === 'prod', // 生产环境需要https
      },
    };

    const { host, port } = this.redisOptions;
    sessionOptions.store = new RedisStore({
      client: new Redis({
        host,
        port,
      }),
    });

    // 配置全局中间件
    consumer
      .apply(
        expressSession(sessionOptions), // 管理会话
      )
      .forRoutes('*');
  }
}
