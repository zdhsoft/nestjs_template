// prettier-ignore
/** RedisSession的选项 */
export interface IRedisOptions {
    /** 是否启用，默认是启用，true表示启用，false表示不启用 */
    enabled?: boolean;
    /** 连接URL redis[s]://[[username][:password]@][host][:port][/db-number] */
    url?: string;
    /** 传统redis配置 */
    cfg?: {
        /** 用户名，仅redis >= 6时才有效 */
        username?: string;
        /** 密码 */
        password?: string;
        /** 端口号 */
        port?: number;
        /** 主机地址 */
        host?: string;
        /** 对应的数据库 */
        database?: number;
    }
}

// prettier-ignore
/**
 * 这个是Store用到的选项
 */
export interface IRedisStoreOptions {
    /** session id在 redis中的key前缀 默认为"session" */
    prefix?      : string;
    /** 每次扫描redis key的数量 默认100 */
    scanCount?   : number;
    /** session有效时间，默认为86400 单位秒 */
    ttl?         : number;
    /** 禁止ttl的标志，默认false */
    disableTTL?  : boolean;
    /** 禁止touch标志，默认false */
    disableTouch?: boolean;
    /**
     * Enables automatic capturing of promise rejection.
     * - 启用自动捕获的Promise的rejection
     * - 默认为undefined
     */
    captureRejections?: boolean | undefined;
}
