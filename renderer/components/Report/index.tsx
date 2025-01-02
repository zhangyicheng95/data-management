/**********************************************************************
 *
 * @模块名称: Report
 *
 * @模块作用: Report
 *
 * @创建人: pgli
 *
 * @date: 2024/3/28 9:02 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { Button, Col, DatePicker, Row, Tabs } from 'antd';
import React, { forwardRef, Ref, useImperativeHandle, useState } from 'react';
import styles from "@/styles/Report.module.scss";
import useRefresh from 'hooks/useRefresh';
import DataReport from './DataReport';
import dayjs from 'dayjs';
import { formatTimestamp, classnames } from '@gaopeng123/utils';
import { exportApi, exportDayStatistics } from './api';
import { UploadOutlined } from '@ant-design/icons';
import ChartReport from './ChartReport';
import { isWeb } from 'utils';

export type ReportRef = {
    refresh?: () => void;
};

type ReportProps = {
    forwardedRef?: Ref<ReportRef>
};

const Report = forwardRef<ReportRef, ReportProps>((props, ref) => {
    const [refreshKey, setRefreshKey] = useState(null);
    useImperativeHandle(ref || props.forwardedRef, () => ({
        // 刷新函数
        refresh() {
            setRefreshKey(Date.now());
        },
    }));

    useRefresh({
        refreshKey: 'Report',
        refresh: () => {
            setRefreshKey(Date.now());
        }
    });

    const [defaultActiveKey, setDefaultActiveKey] = useState('date');

    const onTabsChange = (key: string) => {
        setDefaultActiveKey(key);
    };


    const [defaultDate, setDefaultDate] = useState(formatTimestamp(Date.now()));
    const onChange = (date: any, dateString: any) => {
        setDefaultDate(dateString);
    }

    return (
        <Tabs
            className={classnames(styles.tabs)}
            animated={false}
            defaultActiveKey={defaultActiveKey}
            items={[{
                key: 'date',
                label: '数据分析',
                children: <DataReport refreshKey={refreshKey}/>,
            }, {
                key: 'report',
                label: '图表分析',
                children: <ChartReport refreshKey={refreshKey} date={defaultDate}/>,
            }]}
            onChange={onTabsChange}
            tabBarExtraContent={<div style={{ display: defaultActiveKey === 'date' ? 'none' : 'block' }}>
                <DatePicker style={{ marginRight: 12 }} defaultValue={dayjs(defaultDate, 'YYYY-MM-DD')} size={'small'}
                            onChange={onChange}/>
                {
                    isWeb() ? null : <Button style={{ marginRight: 12 }} onClick={() => {
                        exportDayStatistics(formatTimestamp(defaultDate, 'YYYYMMdd'));
                    }} icon={<UploadOutlined/>} type={'primary'} size={'small'}>导出日统计表</Button>
                }
            </div>}/>
    )
});

export default Report;