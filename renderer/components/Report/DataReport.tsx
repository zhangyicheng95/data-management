/**********************************************************************
 *
 * @模块名称: DateReport
 *
 * @模块作用: DateReport
 *
 * @创建人: pgli
 *
 * @date: 2024/6/7 9:31 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { Col, Row } from 'antd';
import React, { forwardRef, Ref, useImperativeHandle, useState } from 'react';
import AllReportTable from "./AllReportTable";
import MissedKillTable from './MissedKillTable';
import OverkillInNormTable from './OverkillInNormTable';
import OverkillTable from './OverkillTable';
import styles from "@/styles/Report.module.scss";

type DateReportProps = {
    refreshKey: number,
};
const DataReport = (props: DateReportProps) => {
    const { refreshKey } = props;
    const colSpan = {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 12,
        xl: 8,
    }

    const tableHeight = 'calc(50vh - 195px)';
    return (
        <Row gutter={[16, 16]} className={styles.report}>
            <Col span={24}><AllReportTable refreshKey={refreshKey} height={tableHeight}/></Col>
            <Col {...colSpan}><OverkillTable refreshKey={refreshKey} height={tableHeight}/></Col>
            <Col {...colSpan}><MissedKillTable refreshKey={refreshKey} height={tableHeight}/></Col>
            <Col {...colSpan}><OverkillInNormTable refreshKey={refreshKey} height={tableHeight}/></Col>
        </Row>
    )
}

export default DataReport;