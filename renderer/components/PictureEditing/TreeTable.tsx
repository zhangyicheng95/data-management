/**********************************************************************
 *
 * @模块名称: TreeTable
 *
 * @模块作用: TreeTable
 *
 * @创建人: pgli
 *
 * @date: 2024/3/28 11:31 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { cloneElement, useEffect, useRef, useState } from 'react';
import { get } from "httpClient";
import styles from "@/styles/PictureEditing.module.scss";
import { TableRowSelection } from 'antd/es/table/interface';
import { PictureEditingSelectedState } from 'store/dataStore';
import { useRecoilState } from "recoil";
import useRefresh from 'hooks/useRefresh';
import { listApi } from "./api";
import { classnames } from "@gaopeng123/utils";
import { checkType } from 'utils';

type TreeTableProps = {
    height: number,
};
type TreeTableItem = {
    spotType: number,
    autoType: number,
    barCode: string,
};
const TreeTable = (props: TreeTableProps) => {
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<TreeTableItem>[] = [{
        title: '序号',
        dataIndex: 'index',
        valueType: 'index',
        width: 44,
        align: 'center'
    }, {
        title: '电芯条码',
        dataIndex: 'barCode',
        colSize: 3,
        fieldProps: {
            placeholder: '请输入电芯条码'
        }
    }, {
        title: '检测',
        width: 44,
        hideInSearch: true,
        dataIndex: 'autoType',
        align: 'center',
        renderText: (text, record, _, action) => {
            return checkType(text)
        }
    }, {
        title: '点检',
        dataIndex: 'spotType',
        width: 44,
        hideInSearch: true,
        align: 'center',
        renderText: (text, record, _, action) => {
            return checkType(text)
        }
    }];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const rowSelection = {
        hideSelectAll: true,
        type: 'radio',
        columnWidth: 0,
        selectedRowKeys: selectedRowKeys,
        alwaysShowAlert: false,
    } as TableRowSelection<TreeTableItem>;

    const [selectedState, setSelectedTable] = useRecoilState(PictureEditingSelectedState);

    const refresh = () => {
        actionRef.current?.reload();
    }

    useRefresh({
        refreshKey: 'PictureEditing',
        refresh: () => {
            //如果点击的是当前的菜单 此时需要处理下
            refresh();
        }
    });

    /**
     * 刷新标记触发的刷新需要刷新的是全量的数据
     */
    useEffect(() => {
        if (selectedState.refreshKey) {
            refresh();
        }
    }, [selectedState.refreshKey]);

    return (
        <ProTable<TreeTableItem>
            className={styles.TreeTable}
            rowSelection={rowSelection}
            cardProps={{ bodyStyle: {minHeight: 'calc(100vh - 123px)'}}}
            tableAlertRender={false}
            tableAlertOptionRender={false}
            scroll={{ y: props.height - 200 }}
            size={'small'}
            columns={columns}
            actionRef={actionRef}
            cardBordered={false}
            pagination={{
                showSizeChanger: true,
                defaultPageSize: 50,
                showQuickJumper: false,
                showTotal: (title, range) => {
                    return `共 ${title} / ${range[0]} 至 ${range[1]}`;
                }
            }}
            // cardProps={{ className: tableStyle.table }}
            request={async (params, sort, filter) => {
                return  await listApi(params);
            }}
            headerTitle={''}
            rowClassName={classnames({ [styles.rowClassName]: true })}
            onRow={(record) => {
                return {
                    className: classnames({
                        [styles.ok]: record.spotType === 1 || !record.spotType && record.autoType === 1,
                        [styles.ng]: record.spotType === 2 || !record.spotType && record.autoType === 2,
                    }),
                    onClick: (event) => {
                        setSelectedTable({
                            ...selectedState,
                            tree: null,
                            table: record,
                        });
                        // @ts-ignore
                        setSelectedRowKeys([record.barCode]);
                    }, // 点击行
                };
            }}
            rowKey="barCode"
            search={{
                layout: 'horizontal',
                span: 6,
                labelWidth: 'auto',
                defaultCollapsed: false,
                optionRender: (searchConfig, formProps, dom) => {
                    return dom.map((bth: any) => {
                        return cloneElement(bth, {
                            ...bth.props,
                            size: 'small',
                            className: bth.key === 'rest' ? styles.hide : '',
                        })
                    })
                }
            }}
            options={false}
            form={{
                size: 'small'
            }}
            dateFormatter="string"
            toolBarRender={() => [
                // <Button icon={<UploadOutlined/>} type={'primary'} size={'small'}>导出</Button>,
            ]}
        />
    )
}

export default TreeTable;