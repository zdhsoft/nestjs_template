import './init/init';
import { NestFactory } from '@nestjs/core';
import { XAppModule } from './app.module';
import { getLogger } from 'xmcommon';
import { XNestLogger } from './common/nest.logger';
import { XRequestInterceptor } from './common/request.interceptor';
import { XHttpFilterFilter } from './common/http_filter.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import path from 'path';
import { XAuthGuard } from './common/auth.guard';
import { XEnvUtils } from './env_utils';
import { XConfigUtils } from './init/config_utils';
import { XValidationPipe } from './common/validation_pipe';

const log = getLogger(__filename);
log.info('程序开始启动... 当前环境:' + XEnvUtils.env + ' 开发环境:' + XEnvUtils.isDev);
async function bootstrap() {
    const globalConfig = XConfigUtils.getConfig();

    const app = await NestFactory.create<NestExpressApplication>(XAppModule, {
        logger: new XNestLogger(),
    });
    app.use(session(XConfigUtils.buildSessionOptions()));
    // app.useStaticAssets(path.join(process.cwd(), 'public'), { prefix: '/static/' });
    app.useStaticAssets(path.join(process.cwd(), 'public'), {});
    app.setBaseViewsDir(path.join(process.cwd(), 'view')); // 放视图的文件
    app.setViewEngine('ejs');
    app.useGlobalPipes(new XValidationPipe());
    app.useGlobalInterceptors(new XRequestInterceptor());
    app.useGlobalFilters(new XHttpFilterFilter());
    app.useGlobalGuards(new XAuthGuard());

    if (XEnvUtils.isDev) {
        // 如果是开发模式，则加载文档
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { DocumentBuilder, SwaggerModule } = require('@nestjs/swagger');
        const config = new DocumentBuilder()
            .setTitle('Cats example')
            .setDescription('The cats API description')
            .setVersion('1.0')
            .addTag('cats')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('apidoc', app, document);
        log.info('swagger url: /apidoc');
    }

    await app.listen(globalConfig.port as number);
    log.info(`开始侦听:${globalConfig.port}...`);
}
bootstrap();
