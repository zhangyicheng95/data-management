/**********************************************************************
 *
 * @模块名称: SingleReportTable
 *
 * @模块作用: SingleReportTable
 *
 * @创建人: pgli
 *
 * @date: 2024/3/28 9:36 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { useResize } from '@gaopeng123/hooks.use-resize';
import React, { useEffect, useRef, useState } from 'react';
import { checkStatus, get } from "httpClient";
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { clearDownloadList, downloadFile, isWeb } from 'utils';
import { ReportBaseProps } from './typing';
import { exportApi, ExportApiType, ExportTypeMap } from './api';
import styles from '@/styles/Report.module.scss';
import { toFixed } from '@gaopeng123/utils';

type SingleReportTableProps = {
    title: string,
    params: { type: 1 | 2 | 3 } // 1：过杀；2：漏杀；3：规格内
} & ReportBaseProps;

type SingleReportTableItem = {
    total: number,
    num: number,
    rate: number,
    name: string,
};

const SingleReportTable = (props: SingleReportTableProps) => {
    const windowSize = useResize();
    const actionRef = useRef<ActionType>();
    const [loading, setLoading] = useState(false);
    const columns: ProColumns<SingleReportTableItem>[] = [{
        title: '序号',
        dataIndex: 'index',
        valueType: 'index',
        width: 44,
        align: 'center'
    }, {
        title: '类型名称',
        dataIndex: 'name',
    }, {
        title: '总数',
        width: 60,
        align: 'right',
        dataIndex: 'total'
    }, {
        title: '数量',
        dataIndex: 'num',
        align: 'right',
        width: 60
    }, {
        title: '比值(%)',
        dataIndex: 'rate',
        align: 'right',
        width: 80,
        renderText: (text, record, index) => {
            return toFixed(text * 100, 2);
        }
    }];

    const [dataSource, setDataSoruce] = useState([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await get('/spotCheck/info/summary/type', {
                params: props.params,
            });
            if (checkStatus(res)) {
                setDataSoruce(res.data);
            } else {
                setDataSoruce([]);
            }
            setLoading(false);
        })();
    }, [props.refreshKey]);

    return (
        <ProTable<SingleReportTableItem>
            scroll={{ y: props.height }}
            size={'small'}
            loading={loading}
            columns={columns}
            actionRef={actionRef}
            cardBordered={false}
            className={styles.singleReportTable}
            cardProps={{ bodyStyle: {height: 'calc(50vh - 72px)'} }}
            pagination={{
                showQuickJumper: true,
                showTotal: (title, range) => {
                    return `共 ${title} / ${range[0]} 至 ${range[1]}`;
                }
            }}
            dataSource={dataSource}
            headerTitle={props.title}
            rowKey="name"
            search={false}
            options={false}
            form={{}}
            dateFormatter="string"
            toolBarRender={() => isWeb() ? [] :[
                // <Button onClick={() => {
                //     clearDownloadList();
                // }} icon={<UploadOutlined/>} type={'primary'} size={'small'}>清理</Button>,
                <Button onClick={() => {
                    exportApi(ExportTypeMap[props.params.type] as ExportApiType).then((res) => {

                    })
                    // downloadFile({ filePath: '', folderPath: '' });
                }} icon={<UploadOutlined/>} type={'primary'} size={'small'}>导出</Button>,
            ]}
        />
    )
}

export default SingleReportTable;