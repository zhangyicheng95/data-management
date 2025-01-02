/**********************************************************************
 *
 * @模块名称: DetailTree
 *
 * @模块作用: DetailTree
 *
 * @创建人: pgli
 *
 * @date: 2024/3/28 2:35 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, Empty, GetProps, TreeDataNode } from 'antd';
import { Tree } from 'antd';
import styles from "@/styles/PictureEditing.module.scss";
import { useRecoilState } from "recoil";
import { PictureEditingSelectedState } from 'store/dataStore';
import { isEmpty } from '@gaopeng123/utils';
import { checkNgInfo } from './api';

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

type DetailTreeProps = {
    height: number,
}

const DetailTree: React.FC<DetailTreeProps> = (props) => {
    const [selectedState, setSelectedTable] = useRecoilState(PictureEditingSelectedState);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>();
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>();
    const cacheRef = useRef<any>();
    const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
        setSelectedKeys(keys);
        setSelectedTable({
            ...selectedState,
            tree: info.node
        });
    };

    const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
        setExpandedKeys(keys);
    };

    const onChange = (v) => {
        setSelectedTable({
            ...selectedState,
            hasColor: v.target.checked
        })
    }

    const [treeData, setTreeData] = useState([]);

    useEffect(() => {
        const _expandedKeys = [];
        const data = (selectedState?.table?.ccdInfoList || [])?.map((item: any) => {
            _expandedKeys.push(item.name);
            return {
                ...item,
                disabled: true
            }
        });

        if (selectedState.table?.barCode !== cacheRef.current) {
            setSelectedKeys(null);
        }
        setExpandedKeys(_expandedKeys);
        setTreeData(data);
        cacheRef.current = selectedState?.table?.barCode;
    }, [selectedState.table]);

    return (
        <div className={styles.detailsTree} style={{ height: props.height - 99 }}>
            <Checkbox className={styles.checkBox} onChange={onChange}>图片信息着色</Checkbox>
            {
                isEmpty(treeData)
                    ? <Empty description="请选择电芯"/>
                    : <DirectoryTree
                        height={props.height - 107 - 30}
                        showIcon={false}
                        blockNode={true}
                        multiple={false}
                        expandedKeys={expandedKeys}
                        onSelect={onSelect}
                        titleRender={(node) => {
                            if (selectedState.hasColor && !node.directionList) {
                                const ngInfo = checkNgInfo(node);
                                return <div className={ngInfo.length ? styles.ng : styles.ok}>{node.name}</div>
                            } else {
                                return node.name;
                            }
                        }}
                        selectedKeys={selectedKeys}
                        onExpand={onExpand}
                        fieldNames={{ title: 'name', key: 'name', children: 'directionList' }}
                        treeData={treeData}
                    />
            }
        </div>
    );
};

export default DetailTree;
