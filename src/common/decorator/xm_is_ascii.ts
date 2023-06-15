import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';
import { utils } from 'xmcommon';

export const ARRAY_IS_ALL_INTEGER = 'ArrayIsAllInt';
const reg = /^[A-Za-z0-9]+$/;
function checkIsCharDight(paramValue: string): boolean {
    if (!utils.isString(paramValue)) {
        return false;
    }
    if (paramValue.length === 0) {
        return true;
    }
    return reg.test(paramValue);
}

/**
 * 检查字符串，是不是只有数字或大小写字母
 */
export function xmIsCharDight(paramValidationOptions?: ValidationOptions): PropertyDecorator {
    const options = paramValidationOptions;
    return ValidateBy(
        {
            name: ARRAY_IS_ALL_INTEGER,
            validator: {
                validate: (paramValue): boolean => checkIsCharDight(paramValue),
                defaultMessage: buildMessage(() => "$property's 不是由数字和大小写字母组成的字符串", options),
            },
        },
        options,
    );
}
