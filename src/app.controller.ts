import { Controller, Get } from '@nestjs/common';
import { XAppService } from './app.service';
import { NotAuth } from './common/decorator/not_auth';
import { NotCheck } from './common/decorator/not_check';

@Controller()
export class XAppController {
    constructor(private readonly appService: XAppService) {}

    @Get('notauth')
    @NotAuth()
    @NotCheck()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('test')
    test(): string {
        return 'this is test';
    }
}
