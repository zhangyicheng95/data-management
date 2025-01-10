/**********************************************************************
 *
 * @模块名称: SingleLabel
 *
 * @模块作用: SingleLabel
 *
 * @创建人: pgli
 *
 * @date: 2024/3/28 4:51 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React, { useState, useEffect } from 'react';
import styles from "@/styles/PictureEditing.module.scss";

type SingleLabelProps = {
    text?: string,
    color: string,
};
const SingleLabel = (props: SingleLabelProps) => {
    return (
        <span className={styles.label}>
            <span className={styles.color} style={{ background: props.color }}></span>
            <span style={{ paddingLeft: 4 }}>{props.text}</span>
        </span>
    )
}

export default SingleLabel;