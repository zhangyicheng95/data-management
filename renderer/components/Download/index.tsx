/**********************************************************************
 *
 * @模块名称: Download
 *
 * @模块作用: Download
 *
 * @创建人: pgli
 *
 * @date: 2024/4/3 11:34 上午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { LoadingOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import React, { Suspense } from 'react';
import DownloadList from './DownloadList';

const { Text } = Typography;


type DownloadProps = {};
const Download = (props: DownloadProps) => {
    return (
        <>
            <Suspense fallback={<div style={{ paddingRight: 24 }}><LoadingOutlined/></div>}>
                <DownloadList/>
            </Suspense>
        </>
    )
}

export default Download;