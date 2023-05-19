import { XCommonRet } from 'xmcommon';
import { Master } from '../decorator/master.decorator';

/** 一个示例用的Master */
@Master('一个示例用的Master')
export class XSimpleMaster {
    private m_InitFlag: boolean;
    m_Config: any;
    static m_Instance: any;
    public constructor() {
        // 构造函数代码
    }

    /** 是否已经初始化 */
    public get isInit() {
        return this.m_InitFlag;
    }
    private init() {
        // 实始化代码
        const r = new XCommonRet();
        do {
            //
            console.log('一个示例用的Master: 初始化');
        } while (false);
        return r;
    }
    public static getInstance() {
        if (!this.m_Instance) {
            this.m_Instance = new XSimpleMaster();
        }
        return this.m_Instance;
    }
}

export const SimpleMaster = XSimpleMaster.getInstance();
