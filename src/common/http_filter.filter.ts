import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { getLogger } from 'xmcommon';
import { XAPIException } from './api_exception';
import { Request, Response } from 'express';
import { EnumErrorCode } from '../error/error_code';

const log = getLogger('HttpException');

@Catch(Error)
export class XHttpFilterFilter implements ExceptionFilter {
    catch(paramException: Error, paramHost: ArgumentsHost) {
        const ctx = paramHost.switchToHttp();
        const response = ctx.getResponse() as Response;
        const request = ctx.getRequest() as Request;

        const message = paramException.message;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        log.error(`请求发生异常: [${request['seq']}]<== ${request.method} ${request.path} ${message}`);

        let retCode = EnumErrorCode.FAIL;
        let status = HttpStatus.OK;

        if (paramException instanceof XAPIException) {
            retCode = (paramException as XAPIException).errCode;
        } else if (paramException instanceof HttpException) {
            status = (paramException as HttpException).getStatus();
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        const errorResponse = {
            msg: message,
            ret: retCode, // 自定义code
            statusCode: status,
            url: request.originalUrl, // 错误的url地址
        };

        // 设置返回的状态码、请求头、发送错误信息
        response.status(HttpStatus.OK);
        response.header('Content-Type', 'application/json; charset=utf-8');
        response.send(errorResponse);
    }
}
