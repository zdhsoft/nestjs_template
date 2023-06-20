import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
// import { getLogger } from 'xmcommon';
import { ISession } from './constant';
import { XAPIException } from './api_exception';
import { EnumErrorCode } from '../error/error_code';
import { METADATA_NOT_AUTH } from './decorator/not_auth';
// import { getLogger } from 'xmcommon';
// const log = getLogger(__filename);

@Injectable()
export class XAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {
        //
    }
    canActivate(paramContext: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // 这里对验证做了调整，使用NotAuth这个装饰器的请求，将不对会对登录要求验证
        // 之前老的方法是通过urlPrefix定义的前缀来区分是需要验证
        const isNotAuth = this.reflector.get<boolean>(METADATA_NOT_AUTH, paramContext.getHandler());

        if (isNotAuth === true) {
            // log.info('不用验证登录:', paramContext.switchToHttp().getRequest<Request>().path);
            return true;
        } else {
            const host = paramContext.switchToHttp();
            const req = host.getRequest<Request>();
            if ((req.session as ISession)?.isLogin !== true) {
                throw new XAPIException(EnumErrorCode.NOT_LOGIN, '您还没有登录!', req.path);
            } else {
                return true;
            }
        }
    }
}
