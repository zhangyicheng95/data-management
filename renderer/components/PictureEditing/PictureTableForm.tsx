/**********************************************************************
 *
 * @模块名称: PictureTableForm
 *
 * @模块作用: PictureTableForm
 *
 * @创建人: pgli
 *
 * @date: 2024/3/28 6:52 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React, { useEffect, useState } from 'react';
import styles from "@/styles/PictureEditing.module.scss";
import SingleDropdown from './SingleDropdown';
import SingleLabel from './SingleLabel';
import { classnames, randomRgb } from "@gaopeng123/utils";
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';
import SingleTag from './SingleTag';
import { useRecoilState } from 'recoil';
import { PictureEditingSelectedState } from 'store/dataStore';
import { checkList, checkListKey, checkNgInfo, LabelColor } from './api';

type PictureTableFormProps = {};
const PictureTableForm = (props: PictureTableFormProps) => {
    const [selectedState, setSelectedTable] = useRecoilState(PictureEditingSelectedState);
    const onChange = (v) => {
        setSelectedTable({
            ...selectedState,
            image: v.target.value
        })
    }

    const [list, setList] = useState([]);

    useEffect(() => {
        const data = {
            checkLessList: checkList(selectedState?.tree, 'checkLess'),
            checkOverList: checkList(selectedState?.tree, 'checkOver'),
            checkPassList: checkList(selectedState?.tree, 'checkPass')
        }

        const defectConfigList = selectedState.tree?.defectConfigList;

        const newList = [];
        checkListKey?.forEach((listKey, index) => {
            // 找到对应的数据
            data[`${listKey}List`]?.forEach((dataItem) => {
                const currentItem = defectConfigList?.find((_item) => _item.id === dataItem.id);
                if (currentItem) {
                    newList.push(Object.assign({ color: LabelColor[listKey] }, currentItem));
                }
            }); // defect
        });
        setList(newList.sort((a, b) => a.id - b.id > 0 ? 1 : -1));
    }, [selectedState.tree]);

    return (
        <>
            <div className={styles.form}>
                <div className={styles.item}>
                    <span>点检结果：</span>
                    <SingleLabel text={'过杀'} color={LabelColor.checkOver}/>
                    <SingleLabel text={'漏杀'} color={LabelColor.checkLess}/>
                    <SingleLabel text={'规格内'} color={LabelColor.checkPass}/>
                </div>
                {
                    list?.length === 0
                        ? <div className={styles.noData}>暂无数据</div>
                        : <div className={classnames(styles.gap, styles.flex, styles.border)}>
                            {
                                list?.map((item, index) => {
                                    return <SingleTag color={item.color} text={item.defect}/>
                                })
                            }
                        </div>
                }
            </div>
            <div className={styles.form} style={{ paddingTop: '4px' }}>
                <Radio.Group onChange={onChange} value={selectedState.image}>
                    <Radio value={'originPic'}>原图</Radio>
                    <Radio value={'detectPic'}>结果图</Radio>
                </Radio.Group>
            </div>
        </>
    )
}

export default PictureTableForm;