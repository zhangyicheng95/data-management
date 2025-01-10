/**********************************************************************
 *
 * @模块名称: useScannerGunInput
 *
 * @模块作用: useScannerGunInput
 *
 * @创建人: pgli
 *
 * @date: 2024/3/26 5:02 下午
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import React, { useEffect, useState } from 'react';

const useScannerGunInput = (inputRef) => {
    const [scannerInput, setScannerInput] = useState<{ value: string, time: number }>({ value: '', time: Date.now() });
    useEffect(() => {
        //监听扫码枪
        let barCode = '';

        function ClearBarCode() {
            barCode = '';
        }

        const keypress = (event) => {
            const e = event || window.event;
            let code = e.keyCode || e.which || e.charCode;
            if (code == 13 && code != "") {  //13 为按键Enter
                if (barCode.length > 12) {
                    setScannerInput({
                        value: document.activeElement === inputRef.current.input ? inputRef.current.input.value : barCode,
                        time: Date.now()
                    });
                }
                ClearBarCode();
            } else {
                const value = String.fromCharCode(code);
                barCode += value;
            }
        }

        document.addEventListener('keypress', keypress);

        return () => {
            document.removeEventListener('keypress', keypress);
        }
    }, []);
    return scannerInput;
}

export default useScannerGunInput;