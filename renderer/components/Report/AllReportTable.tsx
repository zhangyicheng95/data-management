/**********************************************************************
 *
 * @模块名称: AllReportTable
 *
 * @模块作用: AllReportTable
 *
 * @创建人: pgli
 *
 * @date: 2024/3/28 9:03 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import { checkStatus, get } from "httpClient";
import { Button, DatePicker, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { checkType, dealWithParams, isWeb } from 'utils';
import { ReportBaseProps } from './typing';
import { exportApi } from './api';
import { classnames } from '@gaopeng123/utils';
import styles from '@/styles/PictureEditing.module.scss';

type AllReportTableProps = {} & ReportBaseProps;
type ReportTableItem = {
    barCode: string,
    channel: string,
    checkOverDesc: string,
    checkPassDesc: string,
    checkInfoDesc: string,
    autoType: 1 | 2,
    spotType: 1 | 2,
}
const AllReportTable = (props: AllReportTableProps) => {
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<ReportTableItem>[] = [{
        title: '序号',
        valueType: 'index',
        width: 44,
        align: 'center'
    }, {
        title: '电芯条码',
        dataIndex: 'barCode',
        width: 200,
        render: (text, record, _, action) => {
            return <span className={classnames({
                [styles.ok]: record.spotType === 1 || !record.spotType && record.autoType === 1,
                [styles.ng]: record.spotType === 2 || !record.spotType && record.autoType === 2,
            })}>{text}</span>
        }
    }, {
        title: '通道号',
        dataIndex: 'channel',
        width: 60,
        align: 'center'
    }, {
        title: '检测结果',
        dataIndex: 'autoType',
        width: 80,
        align: 'center',
        renderText: (text, record, _, action) => {
            return checkType(text)
        }
    }, {
        title: '点检结果',
        dataIndex: 'spotType',
        align: 'center',
        width: 80,
        renderText: (text, record, _, action) => {
            return checkType(text)
        }
    }, {
        title: '过杀不良项',
        key: 'checkOverDesc',
        dataIndex: 'checkOverDesc',
    }, {
        title: '漏杀不良项',
        key: 'checkLessDesc',
        dataIndex: 'checkLessDesc',
    }, {
        title: '规格内不良项',
        key: 'checkPassDesc',
        dataIndex: 'checkPassDesc',
    }, {
        title: '检测不良项',
        dataIndex: 'checkInfoDesc',
    }, {
        title: '检测时间',
        dataIndex: 'checkTime',
        width: 160,
    }];

    useEffect(() => {
        if (props.refreshKey) {
            actionRef.current?.reload();
        }
    }, [props.refreshKey]);


    return (
        <ProTable<ReportTableItem>
            scroll={{ y: props.height }}
            size={'small'}
            columns={columns}
            actionRef={actionRef}
            cardBordered={false}
            // cardProps={{ className: tableStyle.table }}
            pagination={{ showQuickJumper: true }}
            request={async (params, sort, filter) => {
                const res = await get('/spotCheck/info/summary', {
                    params: dealWithParams(params),
                })
                if (checkStatus(res)) {
                    return {
                        data: res.data.infoList,
                        total: res.data.total
                    }
                }
                return {
                    data: [],
                    total: 1
                }
            }}
            headerTitle={'总表'}
            rowKey="barCode"
            search={false}
            options={false}
            form={{}}
            dateFormatter="string"
            toolBarRender={() => isWeb() ? [] :[
                <Button icon={<UploadOutlined/>} onClick={() => {
                    exportApi('summaryTable')
                }} type={'primary'} size={'small'}>导出</Button>,
                <Button onClick={() => {
                    exportApi('allTable')
                }} icon={<UploadOutlined/>} type={'primary'} size={'small'}>导出所有表</Button>,
            ]}
        />
    )
}

export default AllReportTable;