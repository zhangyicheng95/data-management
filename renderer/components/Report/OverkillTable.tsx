/**********************************************************************
 *
 * @模块名称: OverkillTable
 *
 * @模块作用: OverkillTable 过杀
 *
 * @创建人: pgli
 *
 * @date: 2024/3/28 9:06 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React from 'react';
import SingleReportTable from './SingleReportTable';
import { ReportBaseProps } from './typing';

type OverkillTableProps = {
} & ReportBaseProps;

const OverkillTable = (props: OverkillTableProps) => {
    return (
        <SingleReportTable refreshKey={props.refreshKey} title={'模型过杀统计'} height={props.height} params={{type: 1}}/>
    )
}

export default OverkillTable;