/**********************************************************************
 *
 * @模块名称: SingleNum
 *
 * @模块作用: SingleNum
 *
 * @创建人: pgli
 *
 * @date: 2024/6/7 10:54 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { Card, Statistic, Typography } from 'antd';
import React, { useState, useEffect } from 'react';

const { Paragraph, Text } = Typography;

type SingleNumProps = {
    title?: string;
    value?: number;
    suffix?: string;
};
const SingleNum = (props: SingleNumProps) => {
    return (
        <Card bordered={false} bodyStyle={{ padding: 12, textAlign: 'center' }}>
            <Statistic title={<Paragraph ellipsis={{tooltip: props.title}}>{props.title}</Paragraph>} value={props.value} suffix={props.suffix}></Statistic>
        </Card>
    )
}

export default SingleNum;