/**********************************************************************
 *
 * @模块名称: useRefresh
 *
 * @模块作用: useRefresh
 *
 * @创建人: pgli
 *
 * @date: 2024/4/10 4:51 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React, { useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { ActionRecordType, ActionRecordTypeCurrent, ActionState } from 'store/dataStore';

type useRefreshProps = {
    refresh: (action: ActionRecordType) => void;
    refreshKey: ActionRecordTypeCurrent
};
const useRefresh = (props: useRefreshProps) => {
    const action = useRecoilValue(ActionState);
    const ref = useRef<any>();
    useEffect(() => {
        if (action.currentSelected === props.refreshKey && ref.current !== JSON.stringify(action)) {
            props.refresh(action);
            ref.current = JSON.stringify(action);
        }
    }, [JSON.stringify(action)]);
}

export default useRefresh;