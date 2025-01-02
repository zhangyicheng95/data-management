/**********************************************************************
 *
 * @模块名称: PictureTable
 *
 * @模块作用: PictureTable
 *
 * @创建人: pgli
 *
 * @date: 2024/3/28 3:07 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React from 'react';
import styles from "@/styles/PictureEditing.module.scss";
import SingleDropdown from './SingleDropdown';
import SingleLabel from './SingleLabel';
import { classnames } from "@gaopeng123/utils";
import PictureTableForm from './PictureTableForm';
import PictureList from './PictureList';

type PictureTableProps = {
    height: number,
};

const PictureTable = (props: PictureTableProps) => {
    return (
        <div className={styles.PictureTable} style={{ height: props.height - 75 }}>
            <PictureTableForm />
            <PictureList height={props.height}/>
        </div>
    )
}

export default PictureTable;