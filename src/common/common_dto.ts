import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Length, Max, Min, ValidationOptions } from 'class-validator';
import { utils } from 'xmcommon';
import validator from 'validator';

// ['md4', 'md5', 'sha1', 'sha256', 'sha384', 'sha512', 'ripemd128', 'ripemd160', 'tiger128',
//  * 'tiger160', 'tiger192', 'crc32', 'crc32b']
/** 常用参数校验信息 */
export const ValidMsg = {
    IsArray: { message: '参数$property要求是数组!' },
    IsInt: { message: '参数$property要求是整数!' },
    IsIn: (paramList: unknown[]): [unknown[], ValidationOptions] => {
        return [paramList, { message: `参数$property不是${paramList}中的值!` }];
    },
    IsEnum: (paramEntiry: object): [object, ValidationOptions] => {
        return [paramEntiry, { message: '参数$property不是指定的枚举值!' }];
    },
    IsEmail: (paramOpts?: validator.IsEmailOptions): [validator.IsEmailOptions | undefined, ValidationOptions] => {
        return [paramOpts, { message: '参数$property不是有效的电子邮箱格式' }];
    },
    IsIntInArray: { message: '参数$property中的每个元素都是整数', each: true },

    IsString: { message: '参数$property要求是字符串' },
    IsStringInArray: { message: '参数$property中的每个元素都是字符串', each: true },

    // IsNumberString: { message: '参数$property要求是数字字符串' },
    // IsNumberStringInArray: { message: '参数$property中的每个元素都是数字字符串', each: true },

    IsBase64: { message: '参数$property的内容不是有效的base64编码' },
    IsAscii: { message: '参数$property要求是ASCII字符' },

    IsPositive: { message: '参数$property要求 > 0的值' },
    IsNegative: { message: '参数$property要求 < 0的值' },

    IsBoolean: { message: '参数$property的内容要求是boolean类型' },
    IsBooleanInArray: { message: '参数$property中的每个元素都是bool类型' },
    IsHash: (
        paramAlgorithm:
            | 'md4'
            | 'md5'
            | 'sha1'
            | 'sha256'
            | 'sha384'
            | 'sha512'
            | 'ripemd128'
            | 'ripemd160'
            | 'tiger128'
            | 'tiger160'
            | 'tiger192'
            | 'crc32'
            | 'crc32b',
    ): [string, ValidationOptions] => {
        return [paramAlgorithm, { message: `参数$property的内容要是${paramAlgorithm}` }];
    },
    MinLength: (paramMinLength: number): [number, ValidationOptions] => {
        return [paramMinLength, { message: `参数$property的最小长度要求是${paramMinLength}` }];
    },
    MaxLength: (paramMaxLength: number): [number, ValidationOptions] => {
        return [paramMaxLength, { message: `参数$property的最大长度要求是${paramMaxLength}` }];
    },
    MinLengthInArray: (paramMinLength: number): [number, ValidationOptions] => {
        return [paramMinLength, { message: `参数$property每个元素的最小长度要求是${paramMinLength}`, each: true }];
    },
    MaxLengthInArray: (paramMaxLength: number): [number, ValidationOptions] => {
        return [paramMaxLength, { message: `参数$property每个元素的最大长度要求是${paramMaxLength}`, each: true }];
    },
    Min: (paramMinValue: number): [number, ValidationOptions] => {
        return [paramMinValue, { message: `参数$property最小值是${paramMinValue}` }];
    },
    MinInArray: (paramMinValue: number): [number, ValidationOptions] => {
        return [paramMinValue, { message: `要求参数$property中的每个元素 >= ${paramMinValue}`, each: true }];
    },
    Max: (paramMaxValue: number): [number, ValidationOptions] => {
        return [paramMaxValue, { message: `参数$property最大值是${paramMaxValue}` }];
    },
    MaxInArray: (paramMaxValue: number): [number, ValidationOptions] => {
        return [paramMaxValue, { message: `要求参数$property中的每个元素 <= ${paramMaxValue}` }];
    },
    Length: (paramMinLength: number, paramMaxLength: number): [number, number, ValidationOptions] => {
        return [
            paramMinLength,
            paramMaxLength,
            { message: `参数$property的长度范围是:[${paramMinLength}, ${paramMaxLength}]` },
        ];
    },
    LengthInArray: (paramMinLength: number, paramMaxLength: number): [number, number, ValidationOptions] => {
        return [
            paramMinLength,
            paramMaxLength,
            { message: `参数$property每个元素的长度范围是:[${paramMinLength}, ${paramMaxLength}]`, each: true },
        ];
    },
    ArrayUnique: { message: `参数$property中存在重复的元素!` },
    ArrayMinSize: (paramMinSize: number): [number, ValidationOptions] => {
        return [paramMinSize, { message: `参数$property的元素至少要有${paramMinSize}个或以上` }];
    },
    ArrayMaxSize: (paramMaxSize: number): [number, ValidationOptions] => {
        return [paramMaxSize, { message: `参数$property的元素最多有${paramMaxSize}个或以下` }];
    },

    IsNumberString: (paramNoSymbol = false): [{ no_symbols: boolean }, ValidationOptions] => {
        return [{ no_symbols: paramNoSymbol }, { message: '参数$property要求是数字字符串!' }];
    },
    IsNumberStringInArray: (paramNoSymbol = false): [{ no_symbols: boolean }, ValidationOptions] => {
        return [{ no_symbols: paramNoSymbol }, { message: '参数$property每个元素要求是数字字符串!', each: true }];
    },
};
/** page信息接口 */
export interface IPageInfoSimple {
    /** 每页的记录数 */
    pageSize?: number;
    /** 当前页号 */
    pageNo?: number;
}
@ApiTags('分页信息')
export class XPageDTO implements IPageInfoSimple {
    /** 每页的记录数 */
    @ApiProperty({ title: '每页的记录数', minimum: 1, maximum: 1000, default: 100 })
    @IsOptional()
    @IsInt({ message: '参数page_size要求是整数!' })
    @Min(1, { message: '参数page_size最小值是1' })
    @Max(1000, { message: '参数page_size最大值是1000' })
    pageSize?: number;

    /** 当前页号 */
    @ApiProperty({ title: '当前页号', minimum: 1, default: 1, description: '最小页号是1' })
    @IsOptional()
    @IsInt({ message: '参数page_no要求是整数!' })
    @Min(1, { message: '参数page_no的值从1开始' })
    pageNo?: number;
}
@ApiTags('分页排序')
export class XPageOrderDTO {
    /** 要排序的名称 */
    @ApiProperty({ title: '要排序的名称', minLength: 1, maxLength: 100 })
    @IsString(ValidMsg.IsString)
    @Length(...ValidMsg.Length(1, 100))
    name: string;

    @ApiPropertyOptional({
        title: '排序方式',
        description: 'true表示升序，false表示降序，未传该值时表示升序（默为为升序）',
    })
    @IsOptional()
    @IsBoolean(ValidMsg.IsBoolean)
    asc?: boolean;
}

/** 分页信息对象 */
export class XPageInfo implements IPageInfoSimple {
    /** 每页的记录数 */
    private m_PageSize = 100;
    /** 当前页号 */
    private m_PageNo = 1;

    public constructor(paramPage?: IPageInfoSimple) {
        this.assignFrom(paramPage);
    }
    /** 赋值 */
    public assignFrom(paramPage?: IPageInfoSimple) {
        const pageSize = utils.isNull(paramPage?.pageSize) ? 100 : (paramPage!.pageSize as number);
        const pageNo = utils.isNull(paramPage?.pageNo) ? 1 : (paramPage!.pageNo as number);
        if (Number.isSafeInteger(pageSize) && pageSize >= 1 && pageSize <= 1000) {
            this.m_PageSize = pageSize;
        } else {
            this.m_PageSize = 100;
        }

        if (Number.isSafeInteger(pageNo) && pageNo >= 1) {
            this.m_PageNo = pageNo;
        } else {
            this.m_PageNo = 1;
        }
    }
    /** 创建一个分页信息对象 */
    static from(paramPage?: IPageInfoSimple) {
        return new XPageInfo(paramPage);
    }

    /** 每页的记录数 */
    public get pageSize() {
        return this.m_PageSize;
    }
    /** 当前页号 */
    public get pageNo() {
        return this.m_PageNo;
    }
    /** 要跳过的记录数 */
    public get skipCount() {
        return utils.calcPageOffset(this.m_PageNo, this.m_PageSize);
    }

    /** 根据当前的记数总数，计算最大的页号 */
    public calcMaxPage(paramCount: number) {
        return utils.calcMaxPage(paramCount, this.m_PageSize);
    }
    // 下面接口是给到typeorm使用的相关

    public get skip() {
        return this.skipCount;
    }

    public get take() {
        return this.pageSize;
    }

    public toJSON() {
        return {
            skip: this.skip,
            take: this.take,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
        };
    }
}

/** 分页的结果接口 */
// prettier-ignore
export interface IPageResult<T = unknown> {
    /** 当前页号 */
    pageNo      : number;
    /** 每页的大小 */
    pageSize    : number;
    /** 当前页的记录集 */
    results     : T[];
    /** 记录数 */
    total       : number;
}
