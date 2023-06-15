import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
// import { getLogger } from 'xmcommon';
import { ISession } from './constant';
import { XAPIException } from './api_exception';
import { EnumErrorCode } from '../error/error_code';
import { METADATA_NOT_AUTH } from './decorator/not_auth';
import { getLogger } from 'xmcommon';
const log = getLogger(__filename);

@Injectable()
export class XAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {
        //
    }
    canActivate(paramContext: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isNotAuth = this.reflector.get<boolean>(METADATA_NOT_AUTH, paramContext.getHandler());
        if (isNotAuth === true) {
            log.info('不用验证登录:', paramContext.switchToHttp().getRequest<Request>().path);
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

        // const host = paramContext.switchToHttp();
        // const req = host.getRequest<Request>();
        // const url = req.path;
        // let ret = false;
        // do {
        //     if (XCommUtils.hasStartsWith(url, urlPrefix.API)) {
        //         if (XCommUtils.hasStartsWith(url, urlPrefix.IGNORE_API)) {
        //             ret = true;
        //         } else {
        //             ret = (req.session as ISession)?.isLogin === true;
        //         }
        //     } else {
        //         ret = true;
        //     }
        // } while (false);
        // if (!ret) {
        //     throw new XAPIException(EnumErrorCode.NOT_LOGIN, '您还没有登录!', url);
        // }
        // return ret;
    }
}
