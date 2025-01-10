/**********************************************************************
 *
 * @模块名称: ChartReport
 *
 * @模块作用: ChartReport
 *
 * @创建人: pgli
 *
 * @date: 2024/6/7 9:46 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { formatTimestamp } from '@gaopeng123/utils';
import { Col, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { chartApi } from './api';
import SingleChart from './SingleChart';
import SingleNum from './SingleNum';

type ChartReportProps = {
    refreshKey: number,
    date: string,
};
const ChartReport = (props: ChartReportProps) => {
    const { refreshKey, date } = props;
    const [data, setData] = useState({
        overList: [], // 过杀列表
        lessList: [], // 漏杀列表
        passList: [], // 规格内列表
        allNum: null, // 检测的电芯总数
        okNum: null, // 点检后ok的电芯总数
        overNum: null, // 过杀的电芯总数
        lessNum: null, // 漏杀的电芯总数
        passNum: null, // 规格内的电芯总数
        excellenceRate: null, //优率
        overkillRate: null, //  过杀率
        leakageRate: null, // 漏杀率
    });
    useEffect(() => {
        chartApi(formatTimestamp(date, 'yyyyMMdd')).then(res => {
            setData(res);
        }).catch(err => {
            console.log(err);
        });
    }, [refreshKey, date]);

    const colSpan = {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 12,
        xl: 8,
    }

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col span={3}><SingleNum title={'检测的电芯总数'} value={data.allNum}/></Col>
                    <Col span={3}><SingleNum title={'点检后OK的电芯总数'} value={data.okNum}/></Col>
                    <Col span={3}><SingleNum title={'过杀的电芯总数'} value={data.overNum}/></Col>
                    <Col span={3}><SingleNum title={'漏杀的电芯总数'} value={data.lessNum}/></Col>
                    <Col span={3}><SingleNum title={'规格内的电芯总数'} value={data.passNum}/></Col>
                    <Col span={3}><SingleNum title={'优率'} value={data.excellenceRate} suffix={'%'}/></Col>
                    <Col span={3}><SingleNum title={'过杀率'} value={data.overkillRate} suffix={'%'}/></Col>
                    <Col span={3}><SingleNum title={'漏杀率'} value={data.leakageRate} suffix={'%'}/></Col>
                </Row>
            </Col>
            <Col {...colSpan}>
                <SingleChart title={'过杀'} data={data.overList}/>
            </Col>
            <Col {...colSpan}>
                <SingleChart title={'漏杀'} data={data.lessList}/>
            </Col>
            <Col {...colSpan}>
                <SingleChart title={'规格内'} data={data.passList}/>
            </Col>
        </Row>
    )
}

export default ChartReport;