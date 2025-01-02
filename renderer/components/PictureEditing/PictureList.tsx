/**********************************************************************
 *
 * @模块名称: PictureList
 *
 * @模块作用: PictureList
 *
 * @创建人: pgli
 *
 * @date: 2024/3/29 9:24 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React, { useEffect, useRef, useState } from 'react';
import styles from "@/styles/PictureEditing.module.scss"
import SinglePicture from './SinglePicture';
import { useRecoilState } from "recoil";
import { getCurrentConfig, PictureEditingSelectedState } from 'store/dataStore';
import { classnames, mapTree, randomInt } from "@gaopeng123/utils";
import { Image } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { checkNgInfo } from './api';
import ScrollTitle from './ScrollTitle';

type PictureListProps = {
    height: number,
};

const PictureList = (props: PictureListProps) => {
    const [list, setList] = useState<any[]>([]);
    const [isFull, setFull] = useState(false);
    const [visible, setVisible] = useState(false);
    const [fullImage, setFullImage] = useState<any>({});
    const divRef = useRef<HTMLDivElement>();
    const [selectedState, setSelectedTable] = useRecoilState(PictureEditingSelectedState);
    const [selected, setSelected] = useState<number>();
    useEffect(() => {
        if (selectedState.table && selectedState.tree) {
            const selectedKey = selectedState.tree.pos;
            const selectedDom: HTMLElement = divRef.current.querySelector(`[data-key=key-${selectedKey}]`);
            divRef.current.children[0].scrollTo({
                top: selectedDom?.offsetTop,//需要父元素设置postion(relative、absolute、fixed)
                behavior: "smooth"
            });
            setSelected(selectedKey);
        }
    }, [selectedState.tree]);

    const setOpacity = (val: number) => {
        // @ts-ignore
        document.querySelector('.App').style.opacity = val;
    }

    useEffect(() => {
        const tree: any = selectedState.table?.ccdInfoList || [];
        const list = [];
        tree.forEach((item: any, index: number) => {
            item.directionList.forEach((listItem: any, listIndex: number) => {
                const ngList = checkNgInfo(listItem);
                list.push({
                    ...listItem,
                    title: listItem.name,
                    ngList: ngList,
                    subTitle: ngList.map(item => item.defect).join(getCurrentConfig().defectSplit),
                    pos: `0-${index}-${listIndex}`
                });
            });
        });
        setList(list);
    }, [selectedState.table]);

    const getImage = (item) => {
        return process.env.NODE_ENV === 'production' ? item[selectedState.image] : item[selectedState.image].replace('http://127.0.0.1', 'http://10.88.223.30')
    }

    const getStyle = (item) => {
        return selectedState.hasColor ? item.ngList?.length > 0 ? styles.ng : styles.ok : ''
    }

    return (
        <div ref={divRef} className={styles.PictureList} style={{ height: props.height - 205 }}>
            {
                isFull ?
                    <>
                        <SinglePicture
                            onImageClick={() => {
                                setVisible(true);
                                setOpacity(.1);
                            }}
                            titleClassName={getStyle(fullImage)}
                            title={fullImage.title}
                            subTitle={fullImage.subTitle}
                            setFull={() => {
                                setFull(false);
                            }}
                            isFull={true}
                            img={getImage(fullImage)}/>
                        <Image
                            width={600}
                            style={{ display: 'none' }}
                            src={getImage(fullImage)}
                            preview={{
                                closeIcon: <FullscreenExitOutlined style={{ fontSize: 20 }}/>,
                                visible: visible,
                                scaleStep: 0.5,
                                src: getImage(fullImage),
                                onVisibleChange: (value) => {
                                    setVisible(value);
                                    setOpacity(1);
                                },
                                imageRender: (originalNode, info) => {
                                    return <div>
                                        <div
                                            className={classnames(styles.fullImageHeader, getStyle(fullImage))}>
                                            <span style={{ display: 'block' }}>{fullImage.title}</span>
                                            <span style={{ display: 'block' }}>
                                                <ScrollTitle title={fullImage.subTitle}/>
                                            </span>
                                        </div>
                                        {originalNode}
                                    </div>
                                }
                            }}
                        />
                    </>
                    : null
            }
            <div className={styles.body} style={isFull ? { opacity: 0 } : {}}>
                {
                    list.map((item, index) => {
                        return <SinglePicture
                            titleClassName={getStyle(item)}
                            key={item.pos}
                            dataKey={item.pos}
                            isSelected={selected === item.pos}
                            title={item.title}
                            subTitle={item.subTitle}
                            setFull={() => {
                                setFullImage(item);
                                setFull(true);
                            }}
                            isFull={false}
                            img={getImage(item)}/>
                    })
                }
            </div>
        </div>
    )
}

export default PictureList;