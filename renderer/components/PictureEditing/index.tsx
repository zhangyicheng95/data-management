/**********************************************************************
 *
 * @模块名称: PictureEditing
 *
 * @模块作用: PictureEditing 图片编辑
 *
 * @创建人: pgli
 *
 * @date: 2024/3/28 11:03 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { useResize } from '@gaopeng123/hooks.use-resize';
import React from 'react';
import styles from "@/styles/PictureEditing.module.scss";
import TreeTable from './TreeTable';
import DetailTree from './DetailTree';
import PictureTable from './PictureTable';
import LocationTree from './LocationTree';
import { classnames } from '@gaopeng123/utils';

type PictureEditingProps = {};
const PictureEditing = (props: PictureEditingProps) => {
    const windowSize = useResize();
    const tableHeight = windowSize.availHeight / 2 - 160;
    return (
        <div className={classnames(styles.content, styles.row)}>
            <div style={{width: 350}}><TreeTable height={windowSize.availHeight}/></div>
            <div style={{width: 180}} className={styles.col}><DetailTree height={windowSize.availHeight}/></div>
            <div style={{width: 180}} className={styles.col}><LocationTree height={windowSize.availHeight}/></div>
            <div className={styles.flexible}><PictureTable height={windowSize.availHeight}/></div>
        </div>
    )
}

export default PictureEditing;