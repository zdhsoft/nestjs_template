import { utils } from 'xmcommon';

/** 常用正则表达式 */
export const CommonRegExp = {
    /** YYYY-MM-DD hh:mm:ss 格式的正则表达式 */
    dateTime: /^[1-2]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/,
    // /** 货币类正则表达式 */
    // curreny: /^\d+(?:\.\d{0,2})?$/,
    /** YYYY-MM-DD 支持 . - / \ 空格分隔符 格式 */
    baseDate:
        /^([1-2]\d{3})[./\-\\\ \u5e74]{1}(0[1-9]|1[0-2]?|[23456789])[./\-\\\ \u6708]{1}(0[1-9]?|1[0-9]?|2[0-9]?|3[0-1]?|[456789])[\u65e5]?$/,
    /** YYYYMMDD 格式的日期正则表达式 */
    simpleDate: /^([1-2]\d{3})(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/,
    /** hh:mm:ss的正则表达式 */
    baseTime: /^([0-1]\d{1}|2[0-3]):([0-5]\d{1}):([0-5]\d{1})$/,
    /** hhmmss的正则表达式 */
    simpleTime: /^([0-1]\d{1}|2[0-3])([0-5]\d{1})([0-5]\d{1})$/,
    /** 诺诺发票用的日期 YYYY-MM-DD 格式 */
    nuonuoDate: /^([1-2]\d{3})[\-](0[1-9]|1[0-2])[\-](0[1-9]|[1-2][0-9]|3[0-1])$/,
    /** 货币，支持千分位 */
    currency: /^-?\d+(,\d{3})*(\.\d{1,2})?$/,
};
/** 正则表达式相关工具 */
export class XRegExpUtils {
    public static date(paramValue: string | number) {
        const v = String(paramValue);
        let r = CommonRegExp.baseDate.exec(v);
        if (utils.isNull(r)) {
            r = CommonRegExp.simpleDate.exec(v);
        }
        if (utils.isNotNull(r)) {
            r!.splice(0, 1);
        }
        return r;
    }
}
