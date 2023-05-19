import { utils } from 'xmcommon';
import * as _ from 'lodash';
/** 可以环境常量定义 */
export enum EnumRuntimeEnv {
    /** 缺省配置环境 */
    default = 'default',
    /** 测试 */
    test = 'test',
    /** 本地调试环境 */
    local = 'local',
    /** 生产环境 */
    production = 'production',
    /** 示例环境 */
    simple = 'simple',
}
/** 被视为生产环境的环境id数组 */
const production_env_list = [EnumRuntimeEnv.production, EnumRuntimeEnv.simple];
/** 环境定义类型定义 */
export interface IEnv {
    /** 当前环境id */
    env: EnumRuntimeEnv;
    /** 是否是开发环境 */
    isDev: boolean;
}
/** 系统启动传入参数接口定义 */
export interface ISystemArgs {
    /** 传入环境id 使用--env envid 传入 */
    env?: EnumRuntimeEnv;
}

/** 全局环境配置 */
const env: IEnv = {
    env: EnumRuntimeEnv.local,
    isDev: true,
};
/** 系统启动传入参数 */
const systemArgs: ISystemArgs = {};

/** 全局变量工具类 */
export class XEnvUtils {
    public static getSystemArgs(): ISystemArgs {
        return _.clone(systemArgs);
    }
    /** 这个返回的是一个克隆的对象，修改它无意义 */
    public static getEnv(): IEnv {
        return _.clone(env);
    }
    /** 判断是否是开发环境 */
    public static get isDev() {
        return env.isDev;
    }
    /** 取当前环境值 */
    public static get env(): EnumRuntimeEnv {
        return env.env;
    }
}

/**
 * 初始化环境值
 */
function initEnv() {
    /** 初始化系统启动入参 */
    const opts = utils.options(process.argv);
    const args: ISystemArgs = opts.args;
    systemArgs.env = args.env;

    let envid = EnumRuntimeEnv.local;
    const redef_env = EnumRuntimeEnv[systemArgs.env as EnumRuntimeEnv];
    if (utils.isString(systemArgs.env) && redef_env === systemArgs.env) {
        envid = systemArgs.env as EnumRuntimeEnv;
    }

    env.env = envid;
    // 除了生产环境，其它都是开发环境
    if (production_env_list.includes(envid)) {
        env.isDev = false;
    } else {
        env.isDev = true;
    }
}
initEnv();
