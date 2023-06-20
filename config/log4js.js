/**
 * 这个是log4js文件配置，具体参数log4js官网
 */
module.exports = exports = {
    replaceConsole: true,
    appenders: {
        log: {
            type: 'file', // 如果需要区分日期的，这个值可以改为datefile
            filename: './logs/log.log',
            maxLogSize: 1024 * 1024 * 10,
            encoding: 'utf-8',
            backups: 100,
            compress: true, // 如果需要压缩，这个值改为true
            keepFileExt: true,
            layout: {
                type: 'messagePassThrough', //是直接跳过头部生成，我这里已经有自定义的头部生成
            },
        },
        err: {
            type: 'file',
            filename: './logs/err.log',
            maxLogSize: 1024 * 1024 * 10,
            encoding: 'utf-8',
            backups: 100,
            compress: true,
            keepFileExt: true,
            layout: {
                type: 'messagePassThrough',
            },
        },
        msg: {
            // 用于记录收发报文的接口
            type: 'file',
            filename: './logs/msg.log',
            maxLogSize: 1024 * 1024 * 10,
            encoding: 'utf-8',
            backups: 100,
            compress: true,
            keepFileExt: true,
            layout: {
                type: 'messagePassThrough',
            },
        },
        console: {
            type: 'stdout',
            layout: { type: 'messagePassThrough' },
        },
    },
    categories: {
        default: { appenders: ['log'], level: 'ALL' },
        error: { appenders: ['err'], level: 'ALL' },
        console: { appenders: ['console'], level: 'ALL' },
        msg: { appenders: ['msg'], level: 'ALL'},
    },
};
