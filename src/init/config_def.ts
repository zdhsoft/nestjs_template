import type { IRedisOptions, IRedisStoreOptions } from '../common/session/xsession_redis_option';

/** 会话类型 */
export enum EnumLRConfigSessionType {
    /** 文件存储类型 */
    file = 'file',
    /** redis存放类型 */
    redis = 'redis',
    /** 这个是默认的 */
    memory = 'memory',
    /** 存放在mysql数据库 */
    mysql = 'mysql',
}

/**
 * 文件存储session的选项 FileStore Options
 * - 一般来说,文件存储的session仅用于测试环境
 * - 这里仅保留了一些有用的配置项
 */
export interface ILRSessionFileStoreOptions {
    /**
     * session文件存放的路径,默认是 `./sessions`
     */
    path?: string | undefined;

    /**
     * session失效时间,单位秒,默认3600秒
     */
    ttl?: number | undefined;

    /**
     * 从会话文件中获取会话数据的重试次数。 默认为`5`
     */
    retries?: number | undefined;

    /**
     * 清除会话时间,单位秒,默认3600秒
     */
    reapInterval?: number | undefined;
}
/** session表的必要的字段列表 */
export interface ILRSessionMySQLStoreClumnNames {
    /** 存放session_id的字段名称,默认为session_id */
    session_id?: string;
    /** 存放超时的字段名称,默认为expires */
    expires?: string;
    /** 存放数据的字段名称,默认为data */
    data?: string;
}
/** session数据库的结构定义 */
export interface ILRSessionMySQLStoreSchema {
    /** 存放session的表名, 默认为lr_sessions */
    tableName?: string;
    /** 必要的字段列表 */
    columnNames?: ILRSessionMySQLStoreClumnNames;
}
/** mysql存session的配置接口 */
export interface ILRSessionMySQLStoreOptions {
    /** mysql的端口,默认为3306 */
    port?: number;
    /** mysql的ip地址,默认为127.0.0.1 */
    host?: string;
    /** mysql存session的数据库, 默认为db_session */
    database?: string;
    /** 连接mysql的用户名,默认为root */
    user?: string;
    /** 连接mysql的密码, 认为空串 */
    password?: string;
    /** 是否自动创建table,默认为true */
    createDatabaseTable?: boolean;
    /** 连接池连接的数量, 默认为 1 */
    connectionLimit?: number;
    /** 有效时间,单位毫秒数,默认是86400000 */
    expiration?: number;
    /** 数据库的字符集类型,默认为utf8mb4 */
    chatset?: string;
    /** 数据库的结构 */
    schema?: ILRSessionMySQLStoreSchema;
}

/** express-session中的cookie选项类型 */
export interface ILRCookieOptions {
    /**
     * 最大生命周期,单位秒毫数。
     */
    maxAge?: number | undefined;
    /**
     * 指定cookie的路径,默认值是'/' 这个是这个整个域的根路径
     */
    path?: string | undefined;

    /**
     * 指定cookie的域,默认是没有设置的,表示适用于当前域
     */
    domain?: string | undefined;

    /**
     * 是否是安全的cookie
     * - 默认是没有设置的,如果设置为true,使用非https的时候,会有可能不兼容,不会设置cookie。无特殊要求,不要设置。
     * Please see the [README](https://github.com/expressjs/session) for an example of using secure cookies in production, but allowing for testing in development based on NODE_ENV.
     */
    secure?: boolean | 'auto' | undefined;
}

/** express-session的选项类型 */
export interface ILRSessionOptions {
    /**
     * 加密字符串,对session的内容加密
     */
    secret: string | string[];

    /**
     * cookie的名称
     */
    name?: string | undefined;

    /**
     * cookie的选项
     * @see ILRCookieOptions
     */
    cookie?: ILRCookieOptions | undefined;

    /**
     * 强制在每个响应上设置会话标识符 cookie。 到期重置为原来的`maxAge`,重置到期倒计时。
     * 默认值为 `false`。
     * 启用此功能后,会话标识符 cookie 将在 `maxAge` *自上次响应被发送*而不是在 `maxAge` 中过期 *因为服务器上次修改会话*。
     * 这通常与短的、非会话长度的“maxAge”值结合使用,以提供会话数据的快速超时
     *   在进行中的服务器交互期间发生的可能性降低。
     * 请注意,当此选项设置为“true”但“saveUninitialized”选项设置为“false”时,将不会在具有未初始化会话的响应上设置 cookie。
     * 此选项仅在为请求加载现有会话时修改行为。
     *
     * @see saveUninitialized
     */
    rolling?: boolean | undefined;

    /**
     * 强制将会话保存回会话存储,即使会话在请求期间从未被修改。
     * 根据您的商店,这可能是必要的,但它也可以创建竞争条件,客户端向您的服务器发出两个并行请求
     * 并且在一个请求中对会话所做的更改可能会在另一个请求结束时被覆盖,即使它没有进行任何更改（此行为还取决于您使用的存储）。
     *
     * 默认值为 `true`,但不推荐使用默认值,因为默认值将来会更改。
     * 请研究此设置并选择适合您的用例的设置。通常,您会需要 `false`。
     *
     * 我怎么知道这对我的商店是否有必要？最好的了解方法是检查您的商店是否实现了“touch”方法。
     * 如果是,那么您可以安全地设置 `resave: false`。
     * 如果它没有实现 `touch` 方法并且你的商店设置了存储会话的过期日期,那么你可能需要 `resave: true`。
     */
    resave?: boolean | undefined;

    /**
     *设置安全 cookie 时信任反向代理（通过“X-Forwarded-Proto”标头）。
     * 默认值未定义。
     * - `true`：将使用 `X-Forwarded-Proto` 标头。
     * - `false`：所有标头都被忽略,只有在存在直接 TLS/SSL 连接时才认为连接是安全的。
     * - `undefined`：使用 express 中的“信任代理”设置     *
     */
    proxy?: boolean | undefined;
}

export interface ILRSessionRedisOptions {
    /** session存储相关的配置 */
    store?: IRedisStoreOptions;
    /** redis的配置 */
    redis?: IRedisOptions;
}

/** 会话配置类型 */
export interface ILRConfigSession {
    /** 会话类型 */
    type: 'file' | 'redis' | 'memory' | 'mysql';
    /** session 选项 */
    options: ILRSessionOptions;
    /** session file选项 当type='file'时有效 */
    fileStoreOptions?: ILRSessionFileStoreOptions;
    /**
     * session redis选项 当type='redis'时有效
     */
    redisOptions?: ILRSessionRedisOptions;
    /** 使用mysql数据库存在session的配置 */
    mysqlStoreOptions?: ILRSessionMySQLStoreOptions;
}

/** mysql配置选项定义 */
export interface ILRConfigMySQL extends Record<string, any> {
    /** 配置的类型 */
    type: 'mysql';
    /** 数据库服务器地址 默认为: localhost */
    host?: string;
    /** 数据库服务器端口 默认为: 3306 */
    port?: number;
    /** 连接数据库的用户名 默认为: root */
    username?: string;
    /** 连接数据库的密码 默认为空串 */
    password?: string;
    /** 连接的数据库 默认为:test */
    database?: string;
    /** 代码中,TypeORM的entiry文件, 默认为['dist/db/*{.ts,.js}']*/
    entities?: [string];
    /** 是否同步,默认为false */
    synchronize?: boolean;
    /** 是否打印日志,默认为false */
    logging?: boolean;
}

/** 已知配置定义 */
export interface ILRConfig extends Record<string, any> {
    /** 服务启动侦听的端口号 */
    port?: number;
    /** 路径相关配置 */
    path?: {
        runtime?: string;
    };
    /** 配置对应的环境id */
    env?: string;
    /** 会话配置 */
    session?: ILRConfigSession;
    /** mysql的配置 */
    mysql?: ILRConfigMySQL;
    /** redis的配置 */
    redis?: IRedisOptions;
}
