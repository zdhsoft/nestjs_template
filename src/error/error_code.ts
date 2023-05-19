/** 项目的错误码 */
export enum EnumErrorCode {
    OK = 0,
    /** 系统错误 */
    FAIL = 1,
    /** master初始化失败 */
    MASTER_INIT_FAILED = 5,
    /** 事物异常 */
    TRANSACTION_EXCEPTION = 6,
    /** 没有实现 */
    NOT_IMPLEMENTED = 7,
    /** 文件不存在 */
    FILE_NOT_EXISTS = 10000,
    /** 目录不存在 */
    DIR_NOT_EXISTS = 10001,
    /** 读取文件失败 */
    READ_FILE_FAIL = 10002,
    /** 解析文件失败 */
    PARSE_FILE_FAIL = 10003,
    /** 请求参数校验失败 */
    QUERY_PARAM_INVALID_FAIL = 10004,
    // /** 密码与密码确认不相等 */
    // PASSWORD_NOT_EQU_REPASSWORD = 10005,
    // /** TypeORM执行SQL语句报错 */
    // TYPEORM_SQL_ERROR = 10006,
    // /** 没有找到指定id的用户 */
    // NOT_FOUND_USER_BY_ID = 10007,
    // /** 没有找到指定account的用户 */
    // NOT_FOUND_USER_BY_ACCOUNT = 10008,
    // /** 不存在的环境 */
    // NOT_EXIST_ENV = 10009,
    /** 你还没有登录 */
    NOT_LOGIN = 10010,
}
