import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { getLogger, XCommonRet } from 'xmcommon';
import { IHttpRet, XRetUtils } from './ret_utils';
import { Response, Request } from 'express';
import { urlPrefix } from './constant';
import { XCommUtils } from './commutils';

const log = getLogger(__filename);
/** 每次请求的记数器 */
let requestSeq = 0;

/**
 * 全局拦截器类
 */
@Injectable()
export class XRequestInterceptor implements NestInterceptor {
    /**
     * 拦截器入口
     * @param paramContext 上下文对象
     * @param paramNext 后续调用函数
     * @returns
     */
    intercept(paramContext: ExecutionContext, paramNext: CallHandler): Observable<any> {
        /** 请求开始时间 */
        const start = Date.now();
        /** 当前环境 */
        const host = paramContext.switchToHttp();
        /** 请求对象 */
        const req = host.getRequest<Request>();
        /** 响应对象 */
        const res = host.getResponse<Response>();
        /** 当前计数 */
        const seq = requestSeq++;
        /** 当前URL */
        const url = req.url; // req.path;
        /** 当前URL */
        const urlInfo = `${req.method} ${url}`;

        log.info(`[${seq}]==> ${urlInfo}`);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        req['seq'] = seq;
        const isCheckAPI = XCommUtils.hasStartsWith(url, urlPrefix.API);

        if (isCheckAPI) {
            return paramNext
                .handle()
                .pipe(
                    map((paramData) => {
                        /* 这里拦截POST返回的statusCode，它默认返回是201, 这里改为200 */
                        if (res.statusCode === HttpStatus.CREATED && req.method === 'POST') {
                            res.statusCode = HttpStatus.OK;
                        }
                        // 这里要求所有的请求返回，都是XCommonRet
                        if (paramData instanceof XCommonRet) {
                            return XRetUtils.byCommonRet(paramData);
                        } else if (paramData === undefined) {
                            log.error('--------- data is undefine!');
                            return paramData;
                        } else {
                            const r: IHttpRet = {
                                ret: -1,
                                msg: '这个请求返回的不是XCommonRet对象!',
                                url: req.originalUrl,
                            };
                            log.error('返回错误:' + JSON.stringify(r));
                            return paramData;
                        }
                    }),
                )
                .pipe(
                    // 这里打印请求处理完成的信息
                    tap(() => log.info(`[${seq}]<== ${urlInfo} ${Date.now() - start} ms`)),
                );
        } else {
            return paramNext.handle().pipe(
                // 这里打印请求处理完成的信息
                tap(() => log.info(`[${seq}]<== ${urlInfo} ${Date.now() - start} ms`)),
            );
        }
    }
}
