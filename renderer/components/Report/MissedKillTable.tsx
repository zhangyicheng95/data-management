/**********************************************************************
 *
 * @模块名称: MissedKillTable
 *
 * @模块作用: MissedKillTable 漏杀
 *
 * @创建人: pgli
 *
 * @date: 2024/3/28 9:07 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React from 'react';
import SingleReportTable from './SingleReportTable';
import { ReportBaseProps } from './typing';

type MissedKillTableProps = {
} & ReportBaseProps;
const MissedKillTable = (props: MissedKillTableProps) => {
    return (
        <SingleReportTable refreshKey={props.refreshKey} title={'模型漏杀统计'} height={props.height} params={{type: 2}}/>
    )
}

export default MissedKillTable;