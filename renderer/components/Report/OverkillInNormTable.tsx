/**********************************************************************
 *
 * @模块名称: OverkillInNormTable
 *
 * @模块作用: OverkillInNormTable 规格内过杀
 *
 * @创建人: pgli
 *
 * @date: 2024/3/28 9:08 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React, { useState, useEffect } from 'react';
import SingleReportTable from './SingleReportTable';
import { ReportBaseProps } from './typing';

type OverkillInNormTableProps = {
} & ReportBaseProps;
const OverkillInNormTable = (props: OverkillInNormTableProps) => {
    return (
        <SingleReportTable refreshKey={props.refreshKey} title={'规格内过杀统计'} height={props.height} params={{type: 3}}/>
    )
}

export default OverkillInNormTable;