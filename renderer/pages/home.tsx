'use client'

import React from 'react';
import { Button } from "antd";
import Router from "next/router"

type PageProps = {};
const Home = (props: PageProps) => {
    return (
        <div className="App">
            <Button onClick={() => {
                Router.push('/next')
            }} type="primary">home</Button>
            <Button onClick={() => {
                console.log(window.ipc)
                window?.ipc?.send('message', {
                    news: Math.random() * 100,
                    title: 'Notification Title',
                    body: 'Notification Body',
                })
            }} type="primary">set</Button>
        </div>
    )
}

export default Home;