import { SetMetadata } from '@nestjs/common';

export const METADATA_NOT_CHECK = 'not_check';
/** 不需要登录验证的装饰器 */
export function NotCheck() {
    return SetMetadata(METADATA_NOT_CHECK, true);
}
