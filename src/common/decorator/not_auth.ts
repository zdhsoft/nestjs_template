import { SetMetadata } from '@nestjs/common';

export const METADATA_NOT_AUTH = 'not_auth';
/** 不需要登录验证的装饰器 */
export function NotAuth() {
    return SetMetadata(METADATA_NOT_AUTH, true);
}
