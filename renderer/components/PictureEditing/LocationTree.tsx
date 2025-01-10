/**********************************************************************
 *
 * @模块名称: LocationTree
 *
 * @模块作用: LocationTree 位置组件
 *
 * @创建人: pgli
 *
 * @date: 2024/4/12 9:42 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React, { useState, useEffect } from 'react';
import styles from "@/styles/PictureEditing.module.scss";
import SingleDropdown from './SingleDropdown';
import { useRecoilState } from 'recoil';
import { PictureEditingSelectedState } from 'store/dataStore';
import { Empty } from 'antd';
import { isEmpty } from '@gaopeng123/utils';
import { checkList, checkListKey, checkNgInfo, LabelColor } from './api';

type LocationTreeProps = {
    height: number,
};

const LocationTree = (props: LocationTreeProps) => {
    const [selectedState, setSelectedTable] = useRecoilState(PictureEditingSelectedState);
    const [data, setData] = useState<any>();
    useEffect(() => {
        setData(Object.assign({ ngList: checkNgInfo(selectedState?.tree) }, {
            checkLessList: checkList(selectedState?.tree, 'checkLess'),
            checkOverList: checkList(selectedState?.tree, 'checkOver'),
            checkPassList: checkList(selectedState?.tree, 'checkPass')
        }, selectedState?.tree));
    }, [selectedState.tree]);

    return (
        <div className={styles.LocationTree} style={{ height: props.height - 99 }}>
            {
                !data?.name
                    ? <Empty description="请选择电芯->位置"/>
                    : <>
                        <div className={styles.title}>{data?.name}</div>
                        <div className={styles.body}>
                            {
                                data?.defectConfigList?.map((item, index) => {
                                    const style: any = {};
                                    checkListKey.forEach((listKey, index) => {
                                        if (data[`${listKey}List`]?.find((_item) => _item.id === item.id)) {
                                            style.backgroundColor = LabelColor[listKey];
                                        }
                                    });

                                    return <SingleDropdown
                                        dataId={item.id}
                                        isNG={data?.ngList?.find((_item) => _item.id === item.id)}
                                        key={item.id}
                                        style={Object.assign(style, { width: '100%' })} text={item.defect}
                                        hasDropdown={true}/>
                                })
                            }
                        </div>
                    </>
            }

        </div>
    )
}

export default LocationTree;