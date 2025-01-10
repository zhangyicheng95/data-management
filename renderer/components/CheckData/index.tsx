/**********************************************************************
 *
 * @模块名称: CheckData
 *
 * @模块作用: CheckData
 *
 * @创建人: pgli
 *
 * @date: 2024/3/25 5:26 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
'use client'
import type { ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { useRef } from 'react';
import tableStyle from "@/styles/checkData.module.scss";
import { useResize } from "@gaopeng123/hooks.use-resize";
import ScannerGunForm from "./ScannerGunForm";
import { checkMsg, checkStatus, get, post } from "httpClient";
import { checkType, dealWithParams } from "utils";
import { isEmpty } from "@gaopeng123/utils";
import { useRecoilState } from 'recoil';
import { ActionState } from 'store/dataStore';

type GithubIssueItem = {
    barCode: string;
    channel: string; // 通道号
    autoType: number; //检测结果 OK：1; NG：2;其他：null
    spotType: number; // 点检 OK：1; NG：2;其他：null
    checkInfo: string; // 检测不良项目
    checkOver: string;
    checkExt: string; // 其他信息
    checkTime: string; // 检测时间
};
export default () => {
    const actionRef = useRef<ActionType>();
    const [action, setAction] = useRecoilState(ActionState);
    const confirm = (recond) => {
        get(`/spotCheck/cache/delete/${recond.barCode}`).then((res) => {
            if (checkStatus(res)) {
                message.success(checkMsg(res));
                refresh();
                setAction({
                    ...action,
                    action: 'del',
                    note: recond.barCode
                });
            } else {
                message.warning(checkMsg(res));
            }
        })
    }

    const cancel = () => {

    }

    const columns: any = [
        {
            title: '序号',
            dataIndex: 'index',
            valueType: 'index',
            width: 44,
            algin: 'center'
        },
        {
            title: '电芯条码',
            dataIndex: 'barCode',
            copyable: true,
            sorter: true,
            width: 220,
        },
        {
            title: '通道号',
            dataIndex: 'channel',
            align: 'center',
            width: 60
        },
        {
            title: '检测结果',
            dataIndex: 'autoType',
            width: 80,
            align: 'center',
            renderText: (text, record, _, action) => {
                return checkType(text)
            }
        },
        {
            title: '检测不良项',
            key: 'showTime',
            dataIndex: 'checkInfo',
            hideInSearch: true,
        },
        {
            title: '检测时间',
            dataIndex: 'checkTime',
            valueType: 'dateTime',
            sorter: true,
            width: 150,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            width: 80,
            align: 'center',
            render: (text, record, _, action) => [
                <Popconfirm
                    title="从点检列表中删除电芯信息?"
                    // description="从点检列表中删除电芯信息?"
                    onConfirm={() => confirm(record)}
                    getPopupContainer={(node) => node.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement}
                    onCancel={cancel}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button type={'link'}>删除</Button>
                </Popconfirm>
            ],
        },
    ];

    const windowSize = useResize();

    const refresh = () => {
        actionRef.current.reload();
    }

    return (
        <>
            <ScannerGunForm refresh={refresh}/>
            <ProTable<GithubIssueItem>
                scroll={{ y: windowSize.availHeight - 250 }}
                size={'small'}
                columns={columns}
                actionRef={actionRef}
                cardBordered={false}
                cardProps={{ className: tableStyle.table, bodyStyle: { minHeight: 'calc(100vh - 170px)' } }}
                pagination={{ showSizeChanger: true, showQuickJumper: true, defaultPageSize: 50 }}
                request={async (params, sort, filter) => {
                    const sortParams = {}
                    if (!isEmpty(sort)) {
                        for (const sortKey in sort) {
                            sortParams['sortField'] = sortKey;
                            sortParams['sortOrder'] = sort[sortKey] === 'ascend' ? 1 : 0;
                        }
                    }
                    try {
                        const res = await post('/spotCheck/cache/getInfos', {
                            body: dealWithParams(Object.assign({}, params, sortParams)),
                        });
                        if (checkStatus(res)) {
                            return {
                                data: res.data.infoList,
                                total: res.data.total
                            }
                        }
                        return {
                            data: [],
                        }
                    } catch (err) {
                        message.warning(`服务异常请稍后重试`);
                        return {
                            data: [],
                        }
                    }
                }}
                rowKey="barCode"
                search={false}
                options={false}
                form={{}}
                dateFormatter="string"
                headerTitle=""
                toolBarRender={() => []}
            />
        </>
    );
};