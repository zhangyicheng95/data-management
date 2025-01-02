/**********************************************************************
 *
 * @模块名称: ParamsSetting
 *
 * @模块作用: ParamsSetting
 *
 * @创建人: pgli
 *
 * @date: 2024/3/27 5:27 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React, { Suspense, useEffect, useState } from 'react';
import { Button, Card, Col, Form, FormProps, Input, message, Row, Select } from "antd";
import styles from "@/styles/ParamsSetting.module.scss";
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { checkMsg, checkStatus, get, post } from 'httpClient';
import { onMain, sentMessage } from 'utils';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CurrentConfigState, CurrentConfigStateType, setCurrentConfig } from 'store/dataStore';

type ParamsSettingProps = {};
const ParamsForm = (props: ParamsSettingProps) => {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useRecoilState<CurrentConfigStateType>(CurrentConfigState);
    const [form] = Form.useForm();
    const onFinish: FormProps<CurrentConfigStateType>["onFinish"] = (values) => {
        setLoading(true);
        const params = [];
        for (const valueKey in values) {
            params.push({
                name: valueKey,
                value: values[valueKey]
            })
        }
        post('/parameter/set', { body: params }).then((res) => {
            if (checkStatus(res)) {
                setIsEdit(false);
                if (values.defectSplit !== config.defectSplit) {
                    setTimeout(() => {
                        message.success('缺陷分隔符修改成功，软件将在2秒后刷新！')
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }, 50);
                }
                message.success(checkMsg(res));
                setCurrentConfig(setConfig, values);
            }
            setLoading(false);
        })
    };

    const onFinishFailed: FormProps<CurrentConfigStateType>["onFinishFailed"] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const [isEdit, setIsEdit] = useState(false);

    const variant: any = {
        variant: isEdit ? 'outlined' : 'borderless', // outlined filled borderless
        disabled: isEdit ? false : true
    }

    useEffect(() => {
        onMain('folder-selected', (v: Array<string>) => {
            if (v.length) {
                form.setFieldsValue({ storagePath: v[0] });
            }
        })
    }, []);

    const title = (str: string) => {
        return (
            <Row>
                <Col span={8} style={{ textAlign: 'right' }}>
                    <div style={{ marginRight: 12, marginBottom: 16, fontSize: 14, fontWeight: 'bold', color: '#000' }}>
                        {str}
                    </div>
                </Col>
                <Col span={16}></Col>
            </Row>
        )
    }

    /**
     * 隐藏MSE参数
     */
    const hideMSE = process.env.NEXTRON_PARAMS_CONFIG === 'hideMSE';

    return (
        <Form name="params-setting"
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={config}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off">
            <Form.Item<CurrentConfigStateType>
                label="缺陷分隔符"
                name="defectSplit"
                rules={[{ required: isEdit, message: '请输入缺陷分隔符!' }, { max: 1 }]}
            >
                <Input {...variant}/>
            </Form.Item>
            {
                title('图片存储')
            }
            <Form.Item<CurrentConfigStateType>
                label="存储路径"
                name="storagePath"
                rules={[{ required: isEdit, message: '请输入存储路径!' }]}
            >
                <Input {...variant} readOnly={true} onClick={() => {
                    sentMessage('select-folder', {});
                }}/>
            </Form.Item>
            <Form.Item<CurrentConfigStateType>
                label="图片类型"
                name="pictureType"
                rules={[{ required: isEdit, message: '请选择图片类型!' }]}
            >
                <Select {...variant}
                        options={[{ label: '原图和结果图', value: 'all' },
                            { label: '原图', value: 'original' },
                            { label: '结果图', value: 'result' },
                            { label: '无', value: 'null' }]}/>
            </Form.Item>
            {
                hideMSE ? null : title('MES访问信息')
            }
            {/*<Form.Item<CurrentConfigStateType>*/}
            {/*    label="URL"*/}
            {/*    name="URL"*/}
            {/*    hidden={hideMSE}*/}
            {/*    rules={[{ required: isEdit, message: '请输入URL!' }]}*/}
            {/*>*/}
            {/*    <Input {...variant}/>*/}
            {/*</Form.Item>*/}
            {/*<Form.Item<CurrentConfigStateType>*/}
            {/*    label="client_Id"*/}
            {/*    name="client_Id"*/}
            {/*    hidden={hideMSE}*/}
            {/*    rules={[{ required: isEdit, message: '请输入client_Id!' }]}*/}
            {/*>*/}
            {/*    <Input {...variant}/>*/}
            {/*</Form.Item>*/}
            {/*<Form.Item<CurrentConfigStateType>*/}
            {/*    label="client_Secret"*/}
            {/*    name="client_Secret"*/}
            {/*    hidden={hideMSE}*/}
            {/*    rules={[{ required: isEdit, message: '请输入client_Secret!' }]}*/}
            {/*>*/}
            {/*    <Input {...variant}/>*/}
            {/*</Form.Item>*/}
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                {
                    isEdit
                        ? <>
                            <Button onClick={(e) => {
                                form.resetFields();
                                setIsEdit(false);
                            }} icon={<CloseOutlined/>} disabled={loading} type="text" style={{ marginRight: 12 }}
                                    className={'ant-btn-primary'}>
                                取消
                            </Button>
                            <Button loading={loading} icon={<CheckOutlined/>} type="primary" htmlType="submit">
                                确定
                            </Button>
                        </>
                        : <Button onClick={(e) => {
                            setIsEdit(true);
                        }} icon={<EditOutlined/>} type="text" className={'ant-btn-primary'}>
                            编辑
                        </Button>
                }
            </Form.Item>
        </Form>
    );
}

export default ParamsForm;