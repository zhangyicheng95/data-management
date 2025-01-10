/**********************************************************************
 *
 * @模块名称: SinglePicture
 *
 * @模块作用: SinglePicture
 *
 * @创建人: pgli
 *
 * @date: 2024/3/29 9:18 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React, { useRef } from 'react';
import Image from 'next/image';
import styles from "@/styles/PictureEditing.module.scss";
import { Button, Tooltip, Typography } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { classnames } from "@gaopeng123/utils"
import ScrollTitle from './ScrollTitle';

const { Text } = Typography;

type SinglePictureProps = {
    dataKey?: string,
    img: string,
    title?: string,
    titleClassName?: string,
    subTitle?: string,
    isFull?: boolean,
    isSelected?: boolean,
    setFull?: () => void,
    onImageClick?: () => void,
};
const SinglePicture = (props: SinglePictureProps) => {
    const isFull = props.isFull;
    const divRef = useRef<HTMLDivElement>();
    return (
        <div ref={divRef} data-key={`key-${props.dataKey}`}
             className={classnames({
                 [styles.SinglePicture]: true,
                 [styles.full]: isFull,
                 [styles.selected]: props.isSelected
             })}>
            <div className={classnames(styles.title, props.titleClassName)}>
                <Text
                    style={{ width: 'calc(100% - 24px)' }}
                    ellipsis={{ tooltip: props.title }}
                >
                    {props.title}
                </Text>
                <Button onClick={props.setFull} type={'text'} size={'small'}
                        icon={isFull ? <FullscreenExitOutlined/> : <FullscreenOutlined/>}></Button>
            </div>
            <div className={classnames(styles.title, props.titleClassName)}>
                <ScrollTitle title={props.subTitle} getPopupContainer={divRef.current}/>
            </div>
            <div onClick={props.onImageClick}
                 className={classnames({ [styles.fullImage]: isFull, [styles.image]: !isFull })}>
                <Image
                    width={150}
                    height={180}
                    style={{ width: 'auto', height: '100%' }}
                    src={props.img}
                    lazyBoundary="0px"
                    loading="lazy"/>
            </div>
        </div>
    )
}

export default SinglePicture;