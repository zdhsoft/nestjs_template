import {
    Like,
    In,
    DataSource,
    EntityManager,
    EntityTarget,
    Between,
    MoreThanOrEqual,
    LessThanOrEqual,
    ObjectLiteral,
} from 'typeorm';
import { utils, XCommonRet, getLogger, datetimeUtils } from 'xmcommon';
import { EnumErrorCode } from '../error/error_code';
import { EnumDBAlias } from './constant';
const log = getLogger(__filename);

export class XTypeormUtils {
    /**
     * 给字段列表增加前缀
     * @param paramPrefix 前缀
     * @param paramFieldList 字段列表
     * @returns
     */
    public static fieldListAddPrefix(paramPrefix: string, paramFieldList: string[]) {
        const r = [];
        for (const f of paramFieldList) {
            r.push(`${paramPrefix}.${f}`);
        }
        return r;
    }
    /**
     * 给指定的属名改名
     * @param paramObject 对象
     * @param paramRename 改名列表
     */
    public static fieldRename(paramObject: any, paramRename: { f: string; t: string }[]) {
        const keys = Object.keys(paramObject);
        const s = new Set();
        keys.forEach((paramKey) => s.add(paramKey));
        for (const r of paramRename) {
            if (r.f === r.t) {
                continue;
            }
            if (s.has(r.f)) {
                paramObject[r.t] = paramObject[r.f];
                delete paramObject[r.f];
                s.delete(r.f);
            }
        }
    }
    /**
     * 简化typeorm的Like方法
     * @param paramValue
     * @returns
     */
    public static like(paramValue?: string) {
        if (utils.isNull(paramValue)) {
            return undefined;
        } else {
            return Like(`%${paramValue}%`);
        }
    }

    /**
     * 取排序模式字符串
     * @param paramAsc 传入true或未传该值，表示升序, 传入false表示降序
     * @returns
     */
    public static getASCString(paramAsc?: boolean) {
        if (paramAsc === null || paramAsc === undefined || paramAsc === true) {
            return 'ASC';
        } else {
            return 'DESC';
        }
    }

    /**
     * 简化typeorm的in方法
     * @param paramList
     * @returns
     */
    public static in(paramList: unknown[]) {
        return In(paramList);
    }
    /**
     * 范围
     * @param paramForm 开始值
     * @param paramTo 结束值
     * @returns 返回undefined，则表示没有表达式
     */
    public static scope<T>(paramForm?: T | null, paramTo?: T | null) {
        let v = 0;
        if (utils.isNotNull(paramForm)) {
            v += 1;
        }
        if (utils.isNotNull(paramTo)) {
            v += 2;
        }
        switch (v) {
            case 1:
                return MoreThanOrEqual<T>(paramForm as T);
            case 2:
                return LessThanOrEqual<T>(paramTo as T);
            case 3:
                return Between<T>(paramForm as T, paramTo as T);
            default:
                return undefined;
        }
    }
    /**
     * 范围
     * @param paramForm 开始值
     * @param paramTo 结束值
     * @returns 返回undefined，则表示没有表达式
     */
    public static scopeDate(paramForm?: Date | null, paramTo?: Date | null) {
        let v = 0;
        if (utils.isNotNull(paramForm)) {
            v += 1;
        }
        if (utils.isNotNull(paramTo)) {
            v += 2;
        }
        switch (v) {
            case 1:
                return MoreThanOrEqual<Date>(datetimeUtils.dateString(paramForm as Date) as unknown as Date);
            case 2:
                return LessThanOrEqual(datetimeUtils.dateString(paramTo as Date) as unknown as Date);
            case 3:
                return Between(
                    datetimeUtils.dateString(paramForm as Date) as unknown as Date,
                    datetimeUtils.dateString(paramTo as Date) as unknown as Date,
                );
            default:
                return undefined;
        }
    }
    /**
     * 简化typeorm的Like方法
     * @param paramValue
     * @returns
     */
    public static like_begin(paramValue?: string) {
        if (utils.isNull(paramValue)) {
            return undefined;
        } else {
            return Like(`${paramValue}%`);
        }
    }
    /**
     * 简化typeorm的Like方法
     * @param paramValue
     * @returns
     */
    public static like_end(paramValue?: string) {
        if (utils.isNull(paramValue)) {
            return undefined;
        } else {
            return Like(`%${paramValue}`);
        }
    }
    /**
     * 删除对象中，属性值为null或undefined的属性
     * @param paramWhere 要处理的对象
     * @returns 处理的对象
     */
    public static cleanNull(paramWhere: any) {
        const delKey: string[] = [];
        for (const k in paramWhere) {
            if (utils.isNull(paramWhere[k])) {
                delKey.push(k);
            }
        }

        for (const k of delKey) {
            delete paramWhere[k];
        }
        return paramWhere;
    }

    /**
     * 处理bigint的参数
     * @param paramValue 要处理的值
     */
    public static bigInt(paramValue?: number): string | undefined {
        if (utils.isNull(paramValue)) {
            return undefined;
        } else {
            return String(paramValue);
        }
    }

    /**
     * 生成查询Builder
     * @param paramMgr EntityManager
     * @param paramEntity EntityTarget<T>
     * @param paramAliasName 别名
     * @returns
     */
    public static builder<Entity extends ObjectLiteral>(
        paramMgr: EntityManager,
        paramEntity: EntityTarget<Entity>,
        paramAliasName: string = EnumDBAlias.a,
    ) {
        return paramMgr.createQueryBuilder<Entity>(paramEntity, paramAliasName);
    }

    /**
     * 事物
     * @param paramDS TypeORM的数据源
     * @param paramRunInTransaction 执行事物的函数
     * @param paramTransName 事物名称，没有传入空串或null
     */
    public static async transaction<T = unknown>(
        paramDS: DataSource,
        paramRunInTransaction: (paramMgr: EntityManager) => Promise<XCommonRet<T>>,
    ): Promise<XCommonRet<T>>;
    public static async transaction<T = unknown>(
        paramDS: DataSource,
        paramRunInTransaction: (paramMgr: EntityManager) => Promise<XCommonRet<T>>,
        paramTransName: string,
    ): Promise<XCommonRet<T>>;
    public static async transaction<T = unknown>(
        paramDS: DataSource,
        paramRunInTransaction: (paramMgr: EntityManager) => Promise<XCommonRet<T>>,
        paramTransName?: string,
    ): Promise<XCommonRet<T>> {
        let transTag = '';
        if (!utils.isEmpty(paramTransName)) {
            transTag = `[${paramTransName}]`;
        }

        const r = new XCommonRet<T>();

        const queryRunner = paramDS.createQueryRunner();
        log.info(`开始事物:${transTag}`);
        await queryRunner.startTransaction();
        try {
            // 执千事物中的逻辑
            const result = await paramRunInTransaction(queryRunner.manager);
            if (result.isNotOK) {
                log.warn(`事物${transTag}执行失败:${JSON.stringify(result)}`);
                await queryRunner.rollbackTransaction();
            } else {
                await queryRunner.commitTransaction();
            }
            r.assignFrom(result);
        } catch (e) {
            r.setError(EnumErrorCode.TRANSACTION_EXCEPTION, `事物异常:${String(e)}`);
            log.warn(`事物${transTag}异常:${JSON.stringify(r)}`);
            await queryRunner.rollbackTransaction();
        }
        await queryRunner.release();
        return r;
    }

    /** 将集合中的元素，转换成数组 */
    public static getSetKeys<T>(paramSet: Set<T>): T[] {
        const r: T[] = [];
        for (const item of paramSet) {
            r.push(item);
        }
        return r;
    }
    /** 将Map中的key，转换成数组 */
    public static getMapKeys<K, V>(paramMap: Map<K, V>): K[] {
        const r: K[] = [];
        for (const [k] of paramMap) {
            r.push(k);
        }
        return r;
    }

    /** 将Map中的Value，转换成数组 */
    public static getMapValues<K, V>(paramMap: Map<K, V>): V[] {
        const r: V[] = [];
        for (const [, v] of paramMap) {
            r.push(v);
        }
        return r;
    }

    /** 将Map中的key和Value，转换成数组 */
    public static getMapKeyValues<K, V>(paramMap: Map<K, V>): { keys: K[]; values: V[] } {
        const r: { keys: K[]; values: V[] } = {
            keys: [],
            values: [],
        };
        for (const [k, v] of paramMap) {
            r.keys.push(k);
            r.values.push(v);
        }
        return r;
    }
}
