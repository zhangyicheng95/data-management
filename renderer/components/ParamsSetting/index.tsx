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
import React, { Suspense } from 'react';
import { Card } from "antd";
import styles from "@/styles/ParamsSetting.module.scss";
import ParamsForm from './ParamsForm';

type FieldType = {
    defectSplit: string,
    URL?: string;
    storagePath?: string;
    pictureType?: string;
    client_Id?: string;
    client_Secret?: string;
};

type ParamsSettingProps = {};
const ParamsSetting = (props: ParamsSettingProps) => {
    return (
        <Suspense
            fallback={<Card loading={true} bordered={false} style={{ height: 'calc(100vh - 80px)', overflowY: 'auto' }}
                            className={styles.notEdit}>
            </Card>}>
            <Card loading={false} bordered={false} style={{ height: 'calc(100vh - 80px)', overflowY: 'auto' }}
                  className={styles.notEdit}>
                <ParamsForm/>
            </Card>
        </Suspense>
    );
}

export default ParamsSetting;