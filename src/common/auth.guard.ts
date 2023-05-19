import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
// import { getLogger } from 'xmcommon';
import { ISession, urlPrefix } from './constant';
import { XAPIException } from './api_exception';
import { EnumErrorCode } from '../error/error_code';
import { XCommUtils } from './commutils';

// const log = getLogger(__filename);

@Injectable()
export class XAuthGuard implements CanActivate {
    canActivate(paramContext: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const host = paramContext.switchToHttp();
        const req = host.getRequest<Request>();
        const url = req.path;
        let ret = false;
        do {
            if (XCommUtils.hasStartsWith(url, urlPrefix.API)) {
                if (XCommUtils.hasStartsWith(url, urlPrefix.IGNORE_API)) {
                    ret = true;
                } else {
                    ret = (req.session as ISession)?.isLogin === true;
                }
            } else {
                ret = true;
            }
        } while (false);
        if (!ret) {
            throw new XAPIException(EnumErrorCode.NOT_LOGIN, '您还没有登录!', url);
        }
        return ret;
    }
}
