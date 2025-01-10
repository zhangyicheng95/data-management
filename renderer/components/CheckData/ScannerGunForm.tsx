/**********************************************************************
 *
 * @模块名称: ScannerGunForm
 *
 * @模块作用: ScannerGunForm
 *
 * @创建人: pgli
 *
 * @date: 2024/3/26 5:00 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Form, Input, message, Modal, Space, Upload } from "antd";
import {
    ClearOutlined,
    ExclamationCircleFilled,
    ExportOutlined,
    PlusOutlined,
    UploadOutlined
} from "@ant-design/icons";
import useScannerGunInput from "./useScannerGunInput";
import styles from "@/styles/checkData.module.scss";
import { checkMsg, checkStatus, get, checkUlr } from 'httpClient';
import { useRecoilState } from 'recoil';
import { ActionState } from 'store/dataStore';
import { clearDownloadList } from 'utils';

const { confirm } = Modal;

type ScannerGunFormProps = {
    refresh?: () => void,
};
const ScannerGunForm = (props: ScannerGunFormProps) => {
    const [action, setAction] = useRecoilState(ActionState);
    const layout = {
        labelCol: {
            xs: { span: 8 },
            sm: { span: 8 },
            md: { span: 6 },
            lg: { span: 4 },
            xl: { span: 3 },
        },
        wrapperCol: { span: 16 },
    };

    const [form] = Form.useForm();

    const [addLoading, setAddLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    const refresh = () => {
        if (props.refresh) {
            props.refresh();
        }
    }

    const upLoadfile = ({file}) => {
        const res = file.response;
        if (file.status === 'done') {
            if(checkStatus(res)) {
                Modal.success({
                    title: '导入成功',
                    content: <>
                        <div>成功：{res.data?.success?.length} 条</div>
                        <div>失败：{res.data?.error?.length + res.data?.unknown?.length} 条</div>
                    </>,
                    onOk() {
                        refresh();
                        setAction({
                            ...action,
                            action: 'add',
                            refreshKey: Date.now(),
                        });
                    },
                });
            } else {
                message.warning(checkMsg(res));
            }
        } else if (file.status === 'error') {

        }
    }

    const inputRef = useRef({
        input: undefined
    } as any);

    const onFinish = (values: any) => {
        setAddLoading(true);
        get(`/spotCheck/info/get/${values.note}`).then((res) => {
            if (checkStatus(res)) {
                if (res.spotCheck === 1) {
                    message.info(`当前条形码已存在`)
                } else {
                    if (props.refresh && res.data) {
                        refresh();
                        message.info(`添加成功`);
                        form.setFieldsValue({ note: '' });
                        // 刷新相关页面
                        setAction({
                            ...action,
                            action: 'add',
                            note: values.note,
                        });
                    } else {
                        message.warning(`【${values.note}】不存在`)
                    }
                }
            } else {
                message.warning(checkMsg(res))
            }
            setAddLoading(false);
        }).catch(() => {
            setAddLoading(false);
        });
    };


    const scannerGunInput = useScannerGunInput(inputRef);

    useEffect(() => {
        if (!addLoading) {
            // 校验是否已经添加
            form.setFieldsValue({ note: scannerGunInput.value });
            if (document.activeElement !== inputRef.current.input) {
                form.submit();
            }
        } else {
            message.info(`当前有正在添加的任务，请稍后！`)
        }
    }, [scannerGunInput]);

    return (
        <Card bordered={false} style={{ marginBottom: 16 }} className={styles.hideFormExplainError}>
            <Form
                {...layout}
                layout={'inline'}
                form={form}
                name="control-hooks"
                onFinish={onFinish}
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <Form.Item name="note" label="电芯条码" rules={[{ required: true }]} style={{ flex: 1 }}>
                    <Input ref={inputRef} autoFocus={true} placeholder={'请使用扫码枪扫码录入'}/>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }} style={{ marginRight: 0, flex: 1, textAlign: 'right' }}>
                    <Space>
                        <Button
                            loading={addLoading}
                            type="primary" htmlType="submit"
                            key="button-submit"
                            icon={<PlusOutlined/>}
                        >
                            新增
                        </Button>
                        <Upload onChange={upLoadfile} accept=".xlsx,.xls"
                                multiple={false} method={'post'} name={'file'}
                                action={checkUlr('/spotCheck/byFile')}
                                itemRender={(file, list) => {
                                    return <></>
                                }}
                        >
                            <Button
                                loading={exportLoading}
                                key="button-export"
                                icon={<UploadOutlined/>}
                            >
                                导入点检表
                            </Button>
                        </Upload>
                        <Button
                            onClick={() => {
                                confirm({
                                    title: '是否要清空当前点检表？',
                                    icon: <ExclamationCircleFilled/>,
                                    // content: 'Some descriptions',
                                    onOk() {
                                        get('/spotCheck/cache/clear').then((res) => {
                                            let msg = checkMsg(res);
                                            refresh();
                                            if (checkStatus(res)) {
                                                clearDownloadList();
                                                message.success(`${msg}, 2秒后刷新页面`);
                                                setTimeout(() => {
                                                    location.reload();
                                                }, 2000);
                                            } else {
                                                message.warning(msg);
                                            }
                                        });
                                    },
                                    onCancel() {
                                        console.log('Cancel');
                                    },
                                });
                            }}
                            key="button-clear"
                            icon={<ClearOutlined/>}
                        >
                            清空点检表
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default ScannerGunForm;