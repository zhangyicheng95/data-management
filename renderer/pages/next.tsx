'use client'

import React from "react";
import { Button } from "antd";
import Router from "next/router";

export default function Home() {
    return (
        <div className="App">
            <Button onClick={()=> {
                Router.push('/home')
            }} type="primary">next</Button>
        </div>
    );
}
