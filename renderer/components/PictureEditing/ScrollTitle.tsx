/**********************************************************************
 *
 * @模块名称: ScrollTitle
 *
 * @模块作用: ScrollTitle
 *
 * @创建人: pgli
 *
 * @date: 2024/4/17 2:36 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
import Marquee from 'react-fast-marquee';

type ScrollTitleProps = {
    title?: string;
    getPopupContainer?: HTMLElement
};
const ScrollTitle = (props: ScrollTitleProps) => {
    return (
        <Marquee speed={20} pauseOnHover pauseOnClick={true} autoFill={false} gradient={false}>
            <Tooltip getPopupContainer={(triggerNode: any) => {
                return props.getPopupContainer
            }} arrow={false} placement="top" title={props.title}>
                {props.title}
            </Tooltip>
        </Marquee>
    )
}

export default ScrollTitle;