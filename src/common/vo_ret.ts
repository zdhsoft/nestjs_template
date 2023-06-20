import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
/** 基本返回VO */
@ApiTags('基本返回VO')
export class XRetVO {
    @ApiProperty({ title: '错误码', description: '0表示成功, 其它表示错误,详见错误定义' })
    ret: number;
    @ApiPropertyOptional({ title: '描述信息' })
    msg?: string;
}
/** 分页信息返回VO */
@ApiTags('分页信息返回VO')
export class XPageDataVO {
    @ApiProperty({ title: '当前页号' })
    pageNo: number;
    @ApiProperty({ title: '每页的大小' })
    pageSize: number;
    @ApiProperty({ title: '记录数' })
    total: number;
}
