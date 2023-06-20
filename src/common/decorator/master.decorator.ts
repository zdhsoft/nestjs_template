import { getLogger, utils, XCommonRet } from 'xmcommon';

const log = getLogger(__filename);

const SINGLETON_KEY = Symbol('master');
/** master列表元素类型 */
interface IMasterListType {
    /** master实例 */
    p: any;
    /** master的名称 */
    name: string;
    /** 调用初始化的参数列表 */
    param: any[];
}
const masterList: IMasterListType[] = [];
const masterListAfter: IMasterListType[] = [];

type TSignleton<T extends new (...args: any[]) => any> = T & {
    [SINGLETON_KEY]: T extends new (...args: any[]) => infer I ? I : never;
};
/**
 * master 装饰器
 * @param paramName master的名称
 * @paramArgs paramArgs 调用master初始化时的参数列表
 * @returns
 */
export function Master(paramName: string, ...paramArgs: any[]): any {
    const p = <T extends { new (...args: any[]): any }>(paramBase: T) => {
        const proxy = new Proxy(paramBase, {
            construct(paramTarget: TSignleton<T>, paramArgList, paramNewTarget) {
                if (paramTarget.prototype !== paramNewTarget.prototype) {
                    return Reflect.construct(paramTarget, paramArgList, paramNewTarget);
                }
                if (!paramTarget[SINGLETON_KEY]) {
                    paramTarget[SINGLETON_KEY] = Reflect.construct(paramTarget, paramArgList, paramNewTarget);
                }
                return paramTarget[SINGLETON_KEY];
            },
        });
        masterList.push({ p: new proxy(), name: paramName, param: paramArgs });
        return proxy;
    };
    return p;
}
/**
 * master 装饰器
 * @param paramName master的名称
 * @paramArgs paramArgs 调用master初始化时的参数列表
 * @returns
 */
export function MasterAfter(paramName: string, ...paramArgs: any[]): any {
    const p = <T extends { new (...args: any[]): any }>(paramBase: T) => {
        const proxy = new Proxy(paramBase, {
            construct(paramTarget: TSignleton<T>, paramArgsList, paramNewTarget) {
                if (paramTarget.prototype !== paramNewTarget.prototype) {
                    return Reflect.construct(paramTarget, paramArgsList, paramNewTarget);
                }
                if (!paramTarget[SINGLETON_KEY]) {
                    paramTarget[SINGLETON_KEY] = Reflect.construct(paramTarget, paramArgsList, paramNewTarget);
                }
                return paramTarget[SINGLETON_KEY];
            },
        });
        masterListAfter.push({ p: new proxy(), name: paramName, param: paramArgs });
        return proxy;
    };
    return p;
}
/**
 * 执行模块初始化
 * - 这个是在指定的环境加载配置完成后执行
 */
export function initMaster() {
    log.info(`全局master初始化开始: 共个${masterList.length}模块`);
    for (let i = 0; i < masterList.length; i++) {
        const f = masterList[i];
        log.info(`>>>>处理[${i + 1}]:"${f.name}"`);
        if (utils.isFunction(f?.p?.init)) {
            log.info('>>>>>>>>初始化master模块:"' + f.name + '"');
            const param = [];
            if (utils.isArray(f.param)) {
                param.push(...f.param);
            }
            const r = f.p.init(...param) as XCommonRet;
            if (r instanceof XCommonRet) {
                if (r.isNotOK) {
                    //
                    log.error(`>>>>>>>>>>>>初始化master模块"${f.name}"失败: code:${r.err}, msg:${r.msg}`);
                    return r;
                }
            } else if (utils.isNotNull(r)) {
                log.info(`>>>>>>>>>>>>初始化master模块"${f.name}"结果：${JSON.stringify(r)}`);
            }
        }
    }
    log.info('全局master初始化完成');
    return new XCommonRet();
}

/**
 * 执行模块初始化
 * - 这个在app实始化后，开始执行
 */
export function initMasterAfter() {
    log.info(`全局master After初始化开始: 共个${masterListAfter.length}模块`);
    for (let i = 0; i < masterListAfter.length; i++) {
        const f = masterListAfter[i];
        log.info(`>>>>处理[${i + 1}]:"${f.name}"`);
        if (utils.isFunction(f?.p?.init)) {
            log.info('>>>>>>>>初始化master模块:"' + f.name + '"');
            const param = [];
            if (utils.isArray(f.param)) {
                param.push(...f.param);
            }
            const r = f.p.init(...param) as XCommonRet;
            if (r instanceof XCommonRet) {
                if (r.isNotOK) {
                    //
                    log.error(`>>>>>>>>>>>>初始化master模块"${f.name}"失败: code:${r.err}, msg:${r.msg}`);
                    return r;
                }
            } else if (utils.isNotNull(r)) {
                log.info(`>>>>>>>>>>>>初始化master模块"${f.name}"结果：${JSON.stringify(r)}`);
            }
        }
    }
    log.info('全局master after初始化完成');
    return new XCommonRet();
}
