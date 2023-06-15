import { Controller, Get } from '@nestjs/common';
import { XAppService } from './app.service';
import { NotAuth } from './common/decorator/not_auth';

@Controller()
export class XAppController {
    constructor(private readonly appService: XAppService) {}

    @Get('notauth')
    @NotAuth()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('test')
    test(): string {
        return 'this is test';
    }
}
