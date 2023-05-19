import * as path from 'path';
import * as log4js from 'log4js';
import * as util from 'util';
import { GetLogManager, ILog, datetimeUtils } from 'xmcommon';

/** 普通日志文件输出 */
let normalLog: log4js.Logger;
/** 错误日志文件输出 */
let errorLog: log4js.Logger;
let consoleLog: log4js.Logger;
/** 报文的处理输出 */
let msgLog: log4js.Logger;

/** 日志级别枚举 */
// prettier-ignore
export enum EnumLogLevel {
    TRACE = 'TRACE',
    DEBUG = 'DEBUG',
    LOG   = '  LOG',
    INFO  = ' INFO',
    ERROR = 'ERROR',
    WARN  = ' WARN',
    MSG   = '  MSG',
}
/** 颜色样式 */
// prettier-ignore
const styles = {
    // styles
    bold        : [1, 22],
    italic      : [3, 23],
    underline   : [4, 24],
    inverse     : [7, 27],
    // grayscale
    white       : [37, 39],
    grey        : [90, 39],
    black       : [90, 39],
    // colors
    blue        : [34, 39],
    cyan        : [36, 39],
    green       : [32, 39],
    magenta     : [35, 39],
    red         : [91, 39],
    yellow      : [33, 39],
};

/**
 * 给日志的head上色
 * @param paramMsg 日志消息
 * @param paramColorStyle 日志颜色
 * @return 上色后的日志
 */
function colored(paramMsg: { head: string; info: string }, paramColorStyle?: number[]): string {
    if (paramColorStyle) {
        return `\x1B[${paramColorStyle[0]}m${paramMsg.head}\x1B[${paramColorStyle[1]}m ${paramMsg.info}`;
    } else {
        return `${paramMsg.head} ${paramMsg.info}`;
    }
}

/**
 * 生成日志
 * @param paramCategoryName 类名名称
 * @param paramLevel 日志级别
 * @param paramData 日志参数内容
 * @return
 */
function buildLog(paramCategoryName: string, paramLevel: string, ...paramData: any[]) {
    return {
        head: `[${datetimeUtils.nowDateString()} ${paramLevel}][${paramCategoryName}]`,
        info: util.format(...paramData),
    };
}

/**
 * 基于Log4js实际日志
 */
class XLogFor4js implements ILog {
    private m_name: string;
    public constructor(paramName: string) {
        this.m_name = paramName;
    }

    public get name() {
        return this.m_name;
    }

    public trace(...paramLog: any[]): void {
        const logInfo = buildLog(this.name, EnumLogLevel.TRACE, ...paramLog);
        normalLog.trace(colored(logInfo));
        consoleLog.trace(colored(logInfo, styles.blue));
    }
    public debug(...paramLog: any[]): void {
        const logInfo = buildLog(this.name, EnumLogLevel.DEBUG, ...paramLog);
        normalLog.debug(colored(logInfo));
        consoleLog.debug(colored(logInfo, styles.cyan));
    }
    public log(...paramLog: any[]): void {
        const logInfo = buildLog(this.name, EnumLogLevel.LOG, ...paramLog);

        normalLog.info(colored(logInfo));
        consoleLog.info(colored(logInfo, styles.magenta));
    }
    public info(...paramLog: any[]): void {
        const logInfo = buildLog(this.name, EnumLogLevel.INFO, ...paramLog);

        normalLog.info(colored(logInfo));
        consoleLog.info(colored(logInfo, styles.green));
    }
    public error(...paramLog: any[]): void {
        const logInfo = buildLog(this.name, EnumLogLevel.ERROR, ...paramLog);
        const logMsg = colored(logInfo);

        normalLog.error(logMsg);
        errorLog.error(logMsg);

        consoleLog.error(colored(logInfo, styles.red));
    }

    public warn(...paramLog: any[]): void {
        const logInfo = buildLog(this.name, EnumLogLevel.WARN, ...paramLog);
        const logMsg = colored(logInfo);

        normalLog.warn(logMsg);
        errorLog.warn(logMsg);
        consoleLog.warn(colored(logInfo, styles.yellow));
    }

    public msg(...paramLog: any[]): void {
        const logInfo = buildLog(this.name, EnumLogLevel.MSG, ...paramLog);
        const logMsg = colored(logInfo);
        normalLog.log(logMsg);
        msgLog.log(logMsg);
        consoleLog.log(colored(logInfo, styles.red));
    }
}
/**
 * 初始化日志
 * @param paramConfigName 配置文件名（js文件）
 */
function InitLog(paramConfigName: string) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cfg = require(paramConfigName);
    log4js.configure(cfg);

    // prettier-ignore
    {
        normalLog  = log4js.getLogger('default');
        errorLog   = log4js.getLogger('error');
        consoleLog = log4js.getLogger('console');
        msgLog     = log4js.getLogger('msg');
    }

    const LogManager = GetLogManager();
    LogManager.setCreateLog((paramTag: string) => new XLogFor4js(paramTag));
    LogManager.setDefaultLog(new XLogFor4js('default'));

    const conLog = LogManager.getLogger('console');

    // prettier-ignore
    {
        // 绑定控制台的日志
        console.log   = conLog.info.bind(conLog);
        console.error = conLog.error.bind(conLog);
        console.debug = conLog.debug.bind(conLog);
        console.warn  = conLog.warn.bind(conLog);
        console.trace = conLog.trace.bind(conLog);
    }
}

/** 生成绝对配置文件路径 */
const configFile = path.join(process.cwd(), 'config', 'log4js.js');
/* 执行初始化 */
InitLog(configFile);
