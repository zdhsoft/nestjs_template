/*
    这个文件主要负责根据当前的系统配置的环境，加载对应的配置文件。
    - 这里配置的文件都是yaml格式的，要放到工作目录的config目录下面，文件名的要求格式为：env.{环境名}.yaml
    - 如：test环境的配置文件是  env.test.yaml， dev环境的配置文件是: env.dev.yaml
    - 除此之外，还有一个默认的配置文件，如果是各环境都是同样的配置，则可以放到这个配置文件中。这个默认的配置文件名是env.default.yaml。
    - 对应的环境中的配置，会替换默认的配置。
    - 配置加载完成后，会在config目录生成一个finalConfig.{环境名}.json和finalConfig.{环境名}.yaml，这个当前环境运行的最新配置
 */

import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import type { Redis, RedisOptions } from 'ioredis';
import type { XRedisStore } from '../common/session/xredis_store';
import type { Store } from 'express-session';
import type {
    ILRConfig,
    ILRConfigMySQL,
    ILRSessionMySQLStoreClumnNames,
    ILRSessionMySQLStoreOptions,
    ILRSessionMySQLStoreSchema,
    ILRSessionRedisOptions,
} from './config_def';
import { getLogger, XCommonRet, utils } from 'xmcommon';
import { EnumErrorCode } from '../error/error_code';
import { EnumRuntimeEnv, XEnvUtils } from '../env_utils';
import type { IRedisOptions, IRedisStoreOptions } from '../common/session/xsession_redis_option';

const log = getLogger(__filename);

/** 当前进程所在的工作目录 */
const currProcessPath = process.cwd();

/** 配置文件所在的目录 */
const configPath = 'config';
const finalPath = 'final';

/** 最终配置输出文件名 */
const finalConfigFileName = 'finalConfig';

/** 配置文件的扩展名 */
const configFileExt = '.yaml';

const cfg: ILRConfig = {};

let runtimePath = path.join(process.cwd(), 'runtime');

/** 配置相关的工具类 */
export class XConfigUtils {
    /**
     * 取当前的配置
     * - 为了防止，取到的配置被人为修改，取的配置是被clone的配置!
     */
    public static getConfig(): ILRConfig {
        return _.cloneDeep(cfg);
    }
    /**
     * 取指定称的配置
     * - 为了防止，取到的配置被人为修改，取的配置是被clone的配置!
     * @param paramName 配置的名称
     * @return 返回的配置对象
     *  - undefined 配置不存在时，返回undefined
     *  - object 配置存在的时候，返回相应的对象
     */
    public static getConfigByName<T = any>(paramName: string): T | undefined {
        const retCfg = cfg[paramName];
        if (utils.isNotNull(retCfg)) {
            return _.cloneDeep(retCfg) as T;
        } else {
            return undefined;
        }
    }

    public static stringOpts(paramValue: unknown, paramDefault: string): string {
        return _.isString(paramValue) ? (paramValue as string) : paramDefault;
    }

    public static intOpts(paramValue: unknown, paramDefault: number): number {
        return Number.isInteger(paramValue) ? (paramValue as number) : paramDefault;
    }

    public static numberOpts(paramValue: unknown, paramDefault: number): number {
        return _.isNumber(paramValue) ? (paramValue as number) : paramDefault;
    }

    public static boolOpts(paramValue: unknown, paramDefault: boolean): boolean {
        return _.isBoolean(paramValue) ? (paramValue as boolean) : paramDefault;
    }

    public static objectOpts(paramValue: unknown, paramDefault: unknown): unknown {
        return _.isObject(paramValue) ? paramValue : paramDefault;
    }

    /**
     * 取指定环境的配置文件名
     * @param paramEnv
     */
    private static getConfigNameByEnv(paramEnv: string): string {
        return path.join(currProcessPath, configPath, `env.${paramEnv}${configFileExt}`);
    }

    private static initMySQLStoreOptions(paramOptions: ILRSessionMySQLStoreOptions) {
        const ret: ILRSessionMySQLStoreOptions = {};

        ret.port = this.intOpts(paramOptions?.port, 3306);
        ret.host = this.stringOpts(paramOptions?.host, 'localhost');
        ret.database = this.stringOpts(paramOptions?.database, 'db_session');
        ret.user = this.stringOpts(paramOptions?.user, 'root');
        ret.password = this.stringOpts(paramOptions?.password, '');
        ret.createDatabaseTable = this.boolOpts(paramOptions?.createDatabaseTable, true);
        ret.connectionLimit = this.intOpts(paramOptions?.connectionLimit, 1);
        ret.chatset = this.stringOpts(paramOptions?.chatset, 'utf8mb4');
        const schema = this.objectOpts(paramOptions?.schema, {}) as ILRSessionMySQLStoreSchema;
        ret.schema = schema;
        schema.tableName = this.stringOpts(paramOptions?.schema?.tableName, 'sessions');
        schema.columnNames = this.objectOpts(paramOptions?.schema?.columnNames, {}) as ILRSessionMySQLStoreClumnNames;
        schema.columnNames.session_id = this.stringOpts(paramOptions?.schema?.columnNames?.session_id, 'session_id');
        schema.columnNames.expires = this.stringOpts(paramOptions?.schema?.columnNames?.expires, 'expires');
        schema.columnNames.data = this.stringOpts(paramOptions?.schema?.columnNames?.data, 'data');

        log.info('session mysql config:\n' + JSON.stringify(ret, null, 2));
        return ret;
    }

    /** 生成连接redis的选项 */
    private static initSessionRedisOptions(paramOptions?: ILRSessionRedisOptions) {
        const store = this.buildRedisStoreOption(paramOptions?.store);
        const redis = this.buildRedisOption(paramOptions?.redis);
        const ret = { store, redis };
        log.info('redis session config:\n' + JSON.stringify(ret, null, 2));
        return ret;
    }
    /**
     * 生成mysql的配置，如果不存在，则返回undefined
     * @returns
     */
    public static buildMySQLOption(): ILRConfigMySQL | undefined {
        const mysqlOpts = cfg?.mysql as ILRConfigMySQL;
        if (utils.isNull(mysqlOpts)) {
            return undefined;
        }
        const retOpts: ILRConfigMySQL = { type: 'mysql' };
        // prettier-ignore
        {
            retOpts.host        = _.isString(mysqlOpts?.host) ? mysqlOpts.host : 'localhost';
            retOpts.port        = Number.isSafeInteger(mysqlOpts?.port) ? mysqlOpts.port : 3306;
            retOpts.username    = _.isString(mysqlOpts?.username) ? mysqlOpts.username : 'root';
            retOpts.password    = _.isString(mysqlOpts.password) ? mysqlOpts.password : '';
            retOpts.database    = _.isString(mysqlOpts?.database) ? mysqlOpts.database : 'test';
            retOpts.entities    = Array.isArray(mysqlOpts?.entities) ? mysqlOpts.entities : ['dist/db/*{.ts,.js}'];
            retOpts.synchronize = _.isBoolean(mysqlOpts?.synchronize) ? mysqlOpts.synchronize : false;
            retOpts.logging     = _.isBoolean(mysqlOpts?.logging) ? mysqlOpts.logging : false;

            log.info('mysqlOptions:' + JSON.stringify(retOpts, null, 4));
        }
        return retOpts;
    }

    /** 构建基于redis的session存储配置 */
    public static buildRedisStoreOption(paramCfg?: IRedisStoreOptions): IRedisStoreOptions {
        const opts: IRedisStoreOptions = paramCfg || {};
        const retOpts: IRedisStoreOptions = {};
        // prettier-ignore
        {
            retOpts.prefix            = utils.stringOpts(opts.prefix, `session_${XEnvUtils.env}`);
            retOpts.scanCount         = utils.intOpts(opts.scanCount, 100);
            retOpts.ttl               = utils.intOpts(opts.ttl, 86400);
            retOpts.disableTTL        = utils.boolOpts(opts.disableTTL, false);
            retOpts.disableTouch      = utils.boolOpts(opts.disableTouch, false);
            retOpts.captureRejections = opts.captureRejections;
        }
        return retOpts;
    }
    /** 构建基于redis存储配置 */
    public static buildRedisOption(paramCfg?: IRedisOptions) {
        const opts: IRedisOptions = paramCfg || {};
        const retOpts: {
            enabled?: boolean;
            url?: string;
            opts?: RedisOptions;
        } = {};

        retOpts.enabled = utils.boolOpts(opts.enabled, true);

        if (opts.url) {
            retOpts.url = opts.url;
        } else {
            retOpts.opts = {};
            if (opts.cfg?.username) {
                retOpts.opts.username = opts.cfg?.username;
            }
            if (opts.cfg?.password) {
                retOpts.opts.password = opts.cfg?.password;
            }
            retOpts.opts.host = utils.stringOpts(opts.cfg?.host, '127.0.0.1');
            retOpts.opts.port = utils.intOpts(opts.cfg?.port, 6379);
            retOpts.opts.db = utils.intOpts(opts.cfg?.database, 0);
        }
        return retOpts;
    }

    /** 生成指定的session选项 */
    public static buildSessionOptions(): any {
        const sessionConfig = cfg?.session;
        const type = sessionConfig?.type;
        let store: Store | undefined = undefined;
        switch (type) {
            case 'mysql':
                {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const session = require('express-session');
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const MySQLStore = require('express-mysql-session')(session);
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const mysql = require('mysql2/promise');

                    const opts = this.initMySQLStoreOptions(
                        sessionConfig?.mysqlStoreOptions as ILRSessionMySQLStoreOptions,
                    );
                    const mysqlOpts = {
                        port: opts.port,
                        host: opts.host,
                        user: opts.user,
                        database: opts.database,
                        password: opts.password,
                    };
                    const pool = mysql.createPool(mysqlOpts);
                    store = new MySQLStore(opts, pool);
                }
                break;
            case 'file':
                {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const session = require('express-session');
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const FileStore = require('session-file-store')(session);

                    store = new FileStore(sessionConfig?.fileStoreOptions);
                }
                break;
            case 'redis':
                {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const redisClass = require('ioredis');
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const { XRedisStore: RedisStore } = require('../common/session/xredis_store');
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    let redis: Redis;
                    const opts = this.initSessionRedisOptions(sessionConfig?.redisOptions);
                    if (opts.redis.url) {
                        redis = new redisClass(opts.redis.url);
                    } else if (opts.redis.opts) {
                        redis = new redisClass(opts.redis.opts);
                    } else {
                        redis = new redisClass();
                    }
                    redis.on('error', (paramError: any) => {
                        if (paramError) {
                            if (paramError.code !== 'ECONNRESET') {
                                log.error('getRedis >>>----------', JSON.stringify(paramError));
                            } else {
                                log.error('getRedis aaa >>>----------', JSON.stringify(paramError));
                                // 因为这个日志，打出来非常多，所以就不用打印了
                                // 大概是每隔65秒，会打印一次这个log，连接会ECONNRESET一次
                                // log.error('----------ECONNRESET', JSON.stringify(error));
                            }
                        }
                    });

                    (opts.store as any).client = redis as any;
                    (opts.store as any).serializer = JSON;
                    store = new RedisStore(opts.store) as XRedisStore;
                }
                break;
            default:
                break;
        }
        let retOptions: any = {};
        if (sessionConfig?.options) {
            retOptions = _.cloneDeep(sessionConfig.options);
        }
        log.info('session options:' + JSON.stringify(retOptions));
        if (store) {
            retOptions.store = store;
        }

        return retOptions;
    }

    /** 加载指定环境的配置 */
    public static loadByEnv(paramEnv: string): XCommonRet<ILRConfig> {
        let ret = new XCommonRet<ILRConfig>();
        do {
            const localCfg: ILRConfig = {
                port: 3000,
            };

            const loadDefaultResult = this.loadConfigByEnv(EnumRuntimeEnv.default);
            if (loadDefaultResult.isNotOK) {
                ret = loadDefaultResult;
                break;
            }

            const loadEnvResult = this.loadConfigByEnv(paramEnv);
            if (loadEnvResult.isNotOK) {
                ret = loadEnvResult;
                break;
            }

            utils.dataAssign(localCfg, loadDefaultResult.data as unknown as object);
            utils.dataAssign(localCfg, loadEnvResult.data as unknown as object);

            utils.dataAssign(cfg, localCfg);

            const finalConfig = cfg;

            const destPath = path.join(currProcessPath, configPath, finalPath);
            // 如果不存在，则创建一个
            if (!utils.fileExistsSync(destPath)) {
                const result = utils.mkdirsSyncEx(destPath);
                if (!result.ret) {
                    ret.setError(-1, result.msg);
                    break;
                }
            }

            const destPathJson = path.join(
                currProcessPath,
                configPath,
                finalPath,
                `${finalConfigFileName}.${paramEnv}.json`,
            );

            this.initRuntimePath();

            const destPathYaml = path.join(
                currProcessPath,
                configPath,
                finalPath,
                `${finalConfigFileName}.${paramEnv}.yaml`,
            );

            fs.writeFileSync(destPathJson, JSON.stringify(finalConfig, null, 4));
            fs.writeFileSync(destPathYaml, yaml.dump(finalConfig));
        } while (false);
        return ret;
    }
    /** 实始化runtime路径 */
    private static initRuntimePath() {
        const rtPath = cfg.path?.runtime as string;
        if (!utils.isString(rtPath)) {
            return;
        }
        if (path.isAbsolute(rtPath)) {
            // 如果是绝对路径，则直接使用
            runtimePath = rtPath;
        } else {
            runtimePath = path.join(process.cwd(), rtPath);
        }
    }
    /** 取当前runtime时间 */
    public static getRuntimePath() {
        return runtimePath;
    }

    // }
    private static loadConfigByEnv(paramEnv: string): XCommonRet<ILRConfig> {
        const fileName = this.getConfigNameByEnv(paramEnv);
        return this.loadConfigByFileName(fileName);
    }

    private static loadConfigByFileName(paramFileName: string): XCommonRet<ILRConfig> {
        const ret = new XCommonRet<ILRConfig>();
        do {
            if (!fs.existsSync(paramFileName)) {
                ret.setError(EnumErrorCode.FILE_NOT_EXISTS, `配置文件:${paramFileName}不存在!`);
                log.error(ret.err);
                break;
            }

            let doc: string;

            try {
                doc = fs.readFileSync(paramFileName, 'utf8');
            } catch (e) {
                ret.setError(EnumErrorCode.READ_FILE_FAIL, `读取配置文件失败:${paramFileName}, err:${String(e)}`);
                break;
            }

            try {
                const cfg = yaml.load(doc) as ILRConfig;
                ret.setOK(cfg);
            } catch (e) {
                ret.setError(EnumErrorCode.PARSE_FILE_FAIL, `解析配置文件失败:${paramFileName}, err:${String(e)}`);
                break;
            }
        } while (false);
        return ret;
    }
}
