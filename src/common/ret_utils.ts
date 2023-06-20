import { utils, XCommonRet } from 'xmcommon';

/**
 * 通用返回数据结构
 */
export interface IHttpRet {
    /** 错误码 */
    ret: number;
    /** 返回的错误信息 */
    msg?: string;
    /** 返回的数据 */
    data?: unknown;
    /** 请求时的url */
    url?: string;
}
/**
 * 返回值工具类
 */
export class XRetUtils {
    /**
     * 生成返回对象
     * @param paramErr 错误码
     * @param paramErrMsg 错误信息
     * @param paramData 返回的数据
     * @param paramURL 请求时的url
     * @returns 请求返回的数据对象
     */
    public static ret(paramErr: number, paramErrMsg?: string, paramData?: unknown, paramURL?: string): IHttpRet {
        return {
            ret: paramErr,
            msg: paramErrMsg,
            data: paramData,
            url: paramURL,
        };
    }

    /**
     * 根据XCommonRet的对象生成返回对象
     * @param paramRet XCommonRet对象实例
     * @returns 请求返回的数据对象
     */
    public static byCommonRet(paramRet: XCommonRet): IHttpRet {
        const data = utils.isNull(paramRet.data) ? undefined : paramRet.data;
        return {
            ret: paramRet.err,
            msg: paramRet.msg,
            data,
        };
    }
}
