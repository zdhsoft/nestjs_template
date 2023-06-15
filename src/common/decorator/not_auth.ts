import { SetMetadata } from '@nestjs/common';

export const METADATA_NOT_AUTH = 'not_auth';

export function NotAuth() {
    return SetMetadata(METADATA_NOT_AUTH, true);
}
