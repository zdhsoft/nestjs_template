import type session from 'express-session';

// prettier-ignore
/** 错误类型枚举 */
export enum EnumErrType {
    OK             = 0,
    Error          = -1,
    NeedAdmin      = 1,    // 需要管理员
    NeedLogin      = 2,    // 登录
    RegisterFail   = 3,    // 注册失败
    AccountList    = 4,    // 用户列表
    ChangePassword = 5,    // 修改密码
    ChangeInfo     = 6,    // 修改信息，名称和email
}
export interface ISessionError {
    type: EnumErrType;
    account?: string;
    errorMsg?: string;
    name?: string;
    email?: string;
}

export interface ISessionUser {
    id?: number;
    account?: string;
    name?: string;
    email?: string;
    ip?: string;
    login_time?: Date;
    env?: string;
}

export interface ISession extends session.Session {
    error?: ISessionError;
    isLogin?: boolean;
    user?: ISessionUser;
}

export const GlobalConst = {
    admin: 'admin',
};
/** 数据库的别名 */
export enum EnumDBAlias {
    a = 'a',
    b = 'b',
    c = 'c',
    d = 'd',
    e = 'e',
    f = 'f',
    g = 'g',
}
