import path from 'path';
import fs from 'fs';
import { utils, XCommonRet } from 'xmcommon';
import { XConfigUtils } from '../init/config_utils';
import { EnumErrorCode } from '../error/error_code';

/** 计数类的实现 */
export class XSeqDef {
    /** 序号 */
    private m_Seq = 0;
    /** 最后修改的时间 */
    private m_LastTime = 0;
    /** 构造函数 */
    public constructor() {
        //
    }
    /**
     * 重置
     */
    public reset() {
        this.m_Seq = 0;
        this.m_LastTime = 0;
    }

    /** 序号 */
    public get Seq(): number {
        return this.m_Seq;
    }
    public set Seq(paramSeq: number) {
        this.m_Seq = paramSeq;
    }

    /** 最后更新的时间 */
    public get LastTime(): number {
        return this.m_LastTime;
    }
    public set LastTime(paramLastTime: number) {
        this.m_LastTime = paramLastTime;
    }
    /**
     * 根据当前的时间更新序号
     */
    public updateSeq(): number {
        return this.updateSeqBySecond(XSeqDef.getTimeNow());
    }

    public static getTime(paramDate: Date): number {
        const t = paramDate.getTime();
        return (t - (t % 1000)) / 1000;
    }
    public static getTimeNow(): number {
        const t = Date.now();
        return (t - (t % 1000)) / 1000;
    }
    /**
     * 根据时间，更新序号，并返回
     * @param paramDate 指定的时间
     */
    public updateSeqByTime(paramDate: Date): number {
        const stSecond = XSeqDef.getTime(paramDate);
        if (stSecond === this.m_LastTime) {
            this.m_Seq++;
        } else {
            this.m_Seq = 0;
            this.m_LastTime = stSecond;
        }
        return this.m_Seq;
    }

    public updateSeqBySecond(paramSecond: number): number {
        const stSecond = paramSecond;
        if (stSecond === this.m_LastTime) {
            this.m_Seq++;
        } else {
            this.m_Seq = 0;
            this.m_LastTime = stSecond;
        }
        return this.m_Seq;
    }
}

export class XCommUtils {
    private static m_Seq = new XSeqDef();
    /**
     * 检查paramValue是不是指定数组中的某一个元素开头，有的话，就返回true， 没有的话，返回false
     * @param paramValue 被检查的字符中
     * @param paramList 指定的开头元素列表
     * @returns 检查结果
     *  - true 表示paramValue中有paramList开头的部分
     *  - false 表示没有符合的
     */
    public static hasStartsWith(paramValue: string, paramList: string[]) {
        for (const item of paramList) {
            if (paramValue.startsWith(item)) {
                return true;
            }
        }
        return false;
    }
    /** 删除URL最的斜杠 */
    public static removeURLLastSlash(paramURL: string): string {
        let u = paramURL.trim();
        const len = u.length;
        const lastIndex = len - 1;
        if (len > 0) {
            const last = u.charAt(lastIndex);
            if (last === '/') {
                u = u.substring(0, lastIndex);
            }
        }
        return u;
    }
}
