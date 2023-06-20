import { Injectable, PipeTransform, ArgumentMetadata, ValidationError } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { EnumErrorCode } from '../error/error_code';
import { XAPIException } from './api_exception';
/**
 * 这是一个全局的参数验证管道，基于class-transformer
 * 如果失败，则会抛出APIException，对应的错误码是EnumErrorCode.QUERY_PARAM_INVALID_FAIL
 * 在main.ts的nestApp要将它设为全局的
 */

@Injectable()
export class XValidationPipe implements PipeTransform {
    async transform(paramValue: any, { metatype: paramMetaType }: ArgumentMetadata) {
        if (!paramMetaType || !this.toValidate(paramMetaType)) {
            return paramValue;
        }
        const object = plainToClass(paramMetaType, paramValue);
        const errors = await validate(object);
        const errorList: string[] = [];
        const errObjList: ValidationError[] = [...errors];

        do {
            const e = errObjList.shift();
            if (!e) {
                break;
            }
            if (e.constraints) {
                for (const item in e.constraints) {
                    errorList.push(e.constraints[item]);
                }
            }
            if (e.children) {
                errObjList.push(...e.children);
            }
        } while (true);
        if (errorList.length > 0) {
            throw new XAPIException(EnumErrorCode.QUERY_PARAM_INVALID_FAIL, '请求参数校验错误:' + errorList.join());
        }
        return object;
    }

    private toValidate(paramMetatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(paramMetatype);
    }
}
