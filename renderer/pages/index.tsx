'use client'
import React, { useRef } from "react";
import type { TabsProps } from 'antd';
import { Tabs } from "antd";
import dynamic from 'next/dynamic';
import { RecoilRoot, useRecoilState, } from 'recoil';
import { ReportRef } from "../components/Report/index";
import { ActionRecordTypeCurrent, ActionState } from "store/dataStore";
import { classnames, isMac } from '@gaopeng123/utils';


const CheckData = dynamic(() => import('../components/CheckData/index'), { ssr: false });
const ParamsSetting = dynamic(() => import('../components/ParamsSetting/index'), { ssr: false });
const Report = dynamic(() => import('../components/Report/index'), { ssr: false });
const PictureEditing = dynamic(() => import('../components/PictureEditing/index'), { ssr: false });
const Download = dynamic(() => import('../components/Download/index'), { ssr: false });

// const ForwardedRefReport = React.forwardRef((props, ref) => (
//     <Report {...props} forwardedRef={ref} />
// ));

export default function Home() {
    const refreshRef = useRef<ReportRef>({});
    const items: TabsProps['items'] = [
        {
            key: 'CheckData',
            label: '点检数据',
            children: <CheckData/>,
        },
        {
            key: 'PictureEditing',
            label: '图片编辑',
            children: <PictureEditing/>,
        },
        {
            key: 'Report',
            label: '数据统计',
            // children: <ForwardedRefReport ref={refreshRef}/>,
            children: <Report/>,
        },
        {
            key: 'ParamsSetting',
            label: '参数设置',
            children: <ParamsSetting/>,
        },
    ];

    const [action, setAction] = useRecoilState(ActionState);

    const onChange = (key: ActionRecordTypeCurrent) => {
        if (key !== 'ParamsSetting') {
            setAction({ ...action, currentSelected: key });
        }
    };

    return (
        <div className={'App'}>
            <Tabs className={classnames({ 'border': true })}
                  animated={false}
                  defaultActiveKey="CheckData"
                  items={items}
                  onChange={onChange}
                  tabBarExtraContent={<Download/>}/>
        </div>
    );
}
