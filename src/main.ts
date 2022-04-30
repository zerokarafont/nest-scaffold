import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { AppModule, storage } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MikroORM } from '@mikro-orm/core';
import { HttpExceptionFilter } from './common';
import express from 'express';
import { HttpResponseInterceptor } from './common/interceptor/response.interceptor';
import { AdminUserModule } from './user';
import { AuthModule } from './auth';
import { FileLocalModule } from './file';

const port = 9000;

function configureGlobalMiddlewares(app: INestApplication) {
  const orm = app.get(MikroORM);
  app.enableCors({
    origin: ['localhost', '127.0.0.1'],
    maxAge: 86400, // 单位s, 在此时间内不用发送重复的预检请求
    credentials: true,
  });
  app
    .use(express.json({ limit: '50mb' }))
    .use(helmet())
    .use((req, res, next) => {
      storage.run(orm.em.fork({ useContext: true }), next);
    });
}

function configureGlobalAOPs(app: INestApplication) {
  app
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    )
    .useGlobalInterceptors(new HttpResponseInterceptor())
    .useGlobalFilters(new HttpExceptionFilter());
}

function configureRestApiDoc(app: INestApplication) {
  if (process.env.NODE_ENV !== 'prod') {
    const adminOptions = new DocumentBuilder()
      /**
       * @warning SwaggerUI的cookie由于浏览器的安全限制授权无效
       * @link https://swagger.io/docs/specification/authentication/cookie-authentication/
       */
      .addCookieAuth('cookieAuth', {
        type: 'apiKey',
        name: 'nft-project',
        in: 'cookie',
      })
      .setTitle('后台管理API文档')
      .setDescription('')
      .setVersion('1.0.0_admin')
      .build();
    const appOptions = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('前端API文档')
      .setDescription('')
      .setVersion('1.0.0_app')
      .build();

    const adminDocument = SwaggerModule.createDocument(app, adminOptions, {
      include: [AdminUserModule, AuthModule, FileLocalModule],
    });
    const appDocument = SwaggerModule.createDocument(app, appOptions, {
      include: [AuthModule],
    });
    /**
     * admin文档json文件
     * @link http://localhost:9000/api/admin-json
     */
    SwaggerModule.setup('/admin', app, adminDocument, {
      useGlobalPrefix: true,
    });
    /**
     * app前端文档json文件
     * @link http://localhost:9000/api/app-json
     */
    SwaggerModule.setup('/app', app, appDocument, {
      useGlobalPrefix: true,
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    /**
     * @link {https://mikro-orm.io/docs/usage-with-nestjs#request-scoping-when-using-graphql}
     */
    bodyParser: false,
  });
  app.setGlobalPrefix('api');
  app.set('trust proxy', 1);

  configureGlobalAOPs(app);
  configureGlobalMiddlewares(app);
  configureRestApiDoc(app);

  if (process.env.NODE_ENV === 'development') {
    await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
    await app.get(MikroORM).getSchemaGenerator().updateSchema();
  }

  await app.listen(port);
}

process.on('unhandledRejection', (reason) => {
  Logger.error('[unhandledRejection], reason: ', reason);
});

process.on('uncaughtException', (error) => {
  Logger.error('uncaughtException', error);
  process.exit(1);
});

bootstrap()
  .then(() => Logger.log(`开始监听${port}端口`))
  .catch((err) => {
    Logger.error(err);
  });
