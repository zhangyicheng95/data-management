/**********************************************************************
 *
 * @模块名称: SingleDropdown
 *
 * @模块作用: SingleDropdown
 *
 * @创建人: pgli
 *
 * @date: 2024/3/28 4:42 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, message, Space } from 'antd';
import { LabelColor, listApi, updateApi } from './api';
import { useRecoilState } from 'recoil';
import { ActionState, PictureEditingSelectedState } from 'store/dataStore';
import { checkStatus, checkMsg } from 'httpClient';
import SingleLabel from './SingleLabel';

type SingleDropdownProps = {
    text: string,
    hasDropdown?: boolean,
    isNG?: boolean,
    dataId?: number,
    style?: React.CSSProperties,
};

const SingleDropdown = (props: SingleDropdownProps) => {
    const [selectedState, setSelectedTable] = useRecoilState(PictureEditingSelectedState);
    const [action, setAction] = useRecoilState(ActionState);
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: <SingleLabel text={'过杀'} color={LabelColor.checkOver}/>,
            disabled: !props.isNG,
        },
        {
            key: '2',
            label: <SingleLabel text={'漏杀'} color={LabelColor.checkLess}/>,
            disabled: !!props.isNG,
        },
        {
            key: '3',
            label: <SingleLabel text={'规格内'} color={LabelColor.checkPass}/>,
            disabled: !props.isNG
        },
        {
            key: '4',
            label: <SingleLabel text={'恢复'} color={'rgba(0,0,0,0)'}/>,
        },
    ];
    const bth = <Button size={'small'} style={props.style}>
        <Space>
            {props.text}
            {
                !props.hasDropdown ? null : <DownOutlined/>
            }
        </Space>
    </Button>;

    return (
        <>
            {
                !props.hasDropdown
                    ? bth
                    : <Dropdown
                        trigger={['click']}
                        menu={{
                            onClick: (e) => {
                                const manualInfoKey = e.key === '4' ? 0 : e.key === '2' ? 2 : 1
                                updateApi({
                                    barCode: selectedState.table.barCode,
                                    manualType: Number(e.key) as any,
                                    manualInfo: `${props.dataId}:${manualInfoKey}`,
                                }).then((res) => {
                                    if (checkStatus(res)) {
                                        listApi({
                                            current: 1,
                                            pageSize: 100,
                                            barCode: selectedState.table.barCode
                                        }).then((listRes) => {
                                            message.success(checkMsg(res));
                                            const { data } = listRes;
                                            const currentReocrd = data.find((item: any) => item.barCode === selectedState.table.barCode);
                                            let currentTree;
                                            for (let item of currentReocrd.ccdInfoList) {
                                                if (currentTree) {
                                                    break;
                                                }
                                                for (const itemElement of item.directionList) {
                                                    if (itemElement.name === selectedState.tree.name) {
                                                        currentTree = itemElement;
                                                        break;
                                                    }
                                                }
                                            }
                                            // 刷新列表
                                            setSelectedTable({
                                                ...selectedState,
                                                table: currentReocrd,
                                                tree: Object.assign({}, selectedState.tree, currentTree),
                                                refreshKey: Date.now(),
                                            });
                                            // 刷新其他模块
                                            setAction({
                                                ...action,
                                                action: 'edit',
                                                note: selectedState.table.barCode,
                                                refreshKey: Date.now(),
                                            });
                                        });
                                    } else {
                                        message.warning(checkMsg(res));
                                    }
                                });
                            },
                            items,
                            selectable: true,
                            // defaultSelectedKeys: ['3'],
                        }}
                    >
                        {bth}
                    </Dropdown>
            }
        </>
    )
}

export default SingleDropdown;