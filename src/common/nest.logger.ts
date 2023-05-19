import { LoggerService } from '@nestjs/common';
import { getLogger } from 'xmcommon';

const log = getLogger('nest');
/**
 * nest的日志类
 */
export class XNestLogger implements LoggerService {
    log(...paramMsg: any[]) {
        log.info(...paramMsg);
    }
    error(...paramMsg: any[]) {
        log.error(...paramMsg);
    }
    warn(...paramMsg: any[]) {
        log.warn(...paramMsg);
    }
    debug(...paramMsg: any[]) {
        log.debug(...paramMsg);
    }
    verbose(...paramMsg: any[]) {
        log.trace(...paramMsg);
    }
}
