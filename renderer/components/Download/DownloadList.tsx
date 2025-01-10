/**********************************************************************
 *
 * @模块名称: DownloadForm
 *
 * @模块作用: DownloadForm
 *
 * @创建人: pgli
 *
 * @date: 2024/4/10 4:32 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { DownloadOutlined, MoreOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, Dropdown, List, message, Progress, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import image from "./image.svg";
import { toFixed } from "@gaopeng123/utils"
import { useRecoilValue } from 'recoil';
import { CurrentConfigStateType, CurrentConfigState, getCurrentConfig } from 'store/dataStore';
import { sentMessage, isWeb } from 'utils';

const { Text } = Typography;


type DownloadProps = {};
const DownloadList = (props: DownloadProps) => {
    const config = useRecoilValue<CurrentConfigStateType>(CurrentConfigState);

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const [listData, setListData] = useState([]);

    // 'stop' | 'pause' | 'progress' | 'completed'
    // 暂停：下载中
    // 恢复下载：已删除 已暂停
    // 删除：下载中 已暂停 下载完成

    useEffect(() => {
        window.ipc?.on('download-list', (list: Array<any>) => {
            setListData(list);
        });

        window.ipc?.on('download-message', ({ type, value }) => {
            message.info(value);
        });

        window.ipc?.send('download-list', { type: 'initDownloadList' });
    }, []);

    return (
        <>
            <div style={{ paddingRight: 12 }}>
                {
                    !isWeb() ? <Button onClick={showDrawer} type={'text'} icon={<DownloadOutlined/>}></Button> : null
                }
            </div>
            <Drawer className={'download'} size={'default'} title="下载管理" onClose={onClose} open={open}>
                <List
                    itemLayout="horizontal"
                    dataSource={listData}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={image.src}/>}
                                title={
                                    <>
                                        <Text
                                            delete={item.type === 'stop'}
                                            style={{
                                                width: 'calc(100% - 40px)',
                                                textDecoration: item.type === 'stop' ? 'line-through' : ''
                                            }}
                                            ellipsis={{ tooltip: item.name }}
                                        >
                                            {item.name}
                                        </Text>
                                        {
                                            (() => {
                                                    switch (item.type) {
                                                        case 'stop':
                                                            return <span>已删除</span>;
                                                        case 'pause':
                                                            return <span>已暂停</span>;
                                                        case 'completed':
                                                            return <span>已完成</span>;
                                                        default:
                                                            return null;
                                                    }
                                                }
                                            )()
                                        }
                                    </>}
                                description={
                                    <>
                                        <Progress percent={toFixed(item.progress, 2)} size="small"/>
                                        <Text
                                            style={{ width: '100%' }}
                                            ellipsis={{ tooltip: item.folderPath }}
                                        >
                                            {item.folderPath}
                                        </Text>
                                    </>
                                }
                            />
                            <div>
                                <Dropdown
                                    menu={{
                                        onClick: (itemMenu) => {
                                            switch (itemMenu.key) {
                                                case 'resume':
                                                    window?.ipc?.send('aDownload', { ...item, action: 'resume' });
                                                    break;
                                                case 'pause':
                                                    window?.ipc?.send('aDownload', { ...item, action: 'pause' });
                                                    break;
                                                case 'stop':
                                                    window?.ipc?.send('aDownload', { ...item, action: 'stop' });
                                                case 'folder':
                                                    sentMessage('open-folder', { folderPath: item.folderPath });
                                                    break;
                                                default:
                                                    break;
                                            }
                                        },
                                        items: [
                                            // {
                                            //     key: 'pause',
                                            //     label: '暂停',
                                            //     disabled: item.type !== 'progress'
                                            // },
                                            // {
                                            //     key: 'resume',
                                            //     label: '恢复下载',
                                            //     disabled: !['stop', 'pause'].includes(item.type)
                                            // },
                                            // {
                                            //     key: 'stop',
                                            //     label: '删除',
                                            //     // disabled: item.type === 'del'
                                            // },
                                            {
                                                key: 'folder',
                                                label: '打开文件夹',
                                                disabled: item.type === 'del'
                                            },
                                        ],
                                        // selectable: true,
                                    }}
                                >
                                    <Button type={'text'} icon={<MoreOutlined/>}/>
                                </Dropdown>
                            </div>
                        </List.Item>
                    )}
                />
            </Drawer>
        </>
    )
}

export default DownloadList;