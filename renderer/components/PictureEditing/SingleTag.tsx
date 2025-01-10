/**********************************************************************
 *
 * @模块名称: SingleTag
 *
 * @模块作用: SingleTag 检测结果显示
 *
 * @创建人: pgli
 *
 * @date: 2024/4/15 10:43 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { addOpacity } from '@gaopeng123/utils';
import React, { useState, useEffect } from 'react';

type SingleTagProps = {
    color?: string,
    text: string | React.ReactNode,
};
const SingleTag = (props: SingleTagProps) => {
    return (
        <span style={{
            // backgroundColor: addOpacity(props.color, 0.2),
            backgroundColor: props.color,
            // color: props.color,
            padding: '0 4px',
            // borderColor: props.color,
            height: 20,
        }}>
            {props.text}
        </span>
    )
}

export default SingleTag;