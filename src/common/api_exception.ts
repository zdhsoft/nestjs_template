/**
 * API调用的默认异常
 */
export class XAPIException extends Error {
    private m_ErrCode: number;
    private m_URL?: string;
    private m_Method?: string;
    public constructor(paramErrorCode: number, paramErrMsg: string, paramURL?: string, paramMethod?: string) {
        super(paramErrMsg);
        this.m_ErrCode = paramErrorCode;
        this.name = 'APIException';
        this.m_URL = paramURL;
        this.m_Method = paramMethod;
    }

    public get errCode() {
        return this.m_ErrCode;
    }

    public get url() {
        return this.m_URL;
    }

    public get method() {
        return this.m_Method;
    }

    public toJSON() {
        return {
            errCode: this.m_ErrCode,
            message: this.message,
            url: this.m_URL,
            method: this.m_Method,
        };
    }
}
