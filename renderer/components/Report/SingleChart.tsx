/**********************************************************************
 *
 * @模块名称: SingleChart
 *
 * @模块作用: SingleChart
 *
 * @创建人: pgli
 *
 * @date: 2024/6/7 10:00 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React, { useState, useEffect } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {
    BarChart,
} from 'echarts/charts';
import {
    GridComponent,
    TooltipComponent,
    TitleComponent,
    DatasetComponent,
} from 'echarts/components';

import {
    CanvasRenderer,
    // SVGRenderer,
} from 'echarts/renderers';
import { Card, Empty } from 'antd';

echarts.use(
    [TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]
);

type SingleChartProps = {
    data?: any,
    title?: string,
};
const SingleChart = (props: SingleChartProps) => {
    const onChartReadyCallback = (echart: any) => {
    };
    const EventsDict = {
        'click': (params: any) => {}
    }
    const [option, setOption] = useState({});
    useEffect(() => {
        setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                top: 20,
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: props.data?.map(item => item.desc)
            },
            series: [
                {
                    data: props.data?.map(item => item.count),
                    type: 'bar',
                    barMaxWidth: 30,
                    barMinWidth: 10,
                }
            ]
        });
    }, [props.data]);
    return (
        <Card bordered={false} bodyStyle={{ padding: 0, height: 300 }} title={props.title}>
            {
                props.data?.length === 0
                    ? <Empty style={{ marginTop: 100 }} description="暂无数据"/>
                    : <ReactEChartsCore
                        echarts={echarts}
                        option={option}
                        notMerge={true}
                        lazyUpdate={true}
                        theme={"theme_name"}
                        onChartReady={onChartReadyCallback}
                        onEvents={EventsDict}
                        opts={{}}
                    />
            }
        </Card>
    )
}

export default SingleChart;