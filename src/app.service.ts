import { Injectable } from '@nestjs/common';

@Injectable()
export class XAppService {
    getHello(): string {
        return 'Hello World!';
    }
}
