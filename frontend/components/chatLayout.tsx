import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import AsideMessages from './AsideMessages'
import { useSocket } from '@/hooks/useSocket'
import { useRouter } from 'next/router'
import { cloneElement, useEffect, useState } from 'react'
import React from 'react'
export default function LayoutChat({ children, title }: { title: string, children: JSX.Element }) {
    const io = useSocket('localhost:8081')
    const route = useRouter()


    type MessagesTelWs = {
        name: string,
        messages: string[]
        profile: string,
        id: string
    }

    const [messages, setMessage] = useState<MessagesTelWs[]>([])

    const childrenWithProps = React.Children.map(children, (child) =>
        cloneElement(child, { io, messages })
    );
    useEffect(() => {
        if (typeof route.query.apiKey == 'string') {

            if (io) {
                io.on('connect', () => {
                    io.emit('bot_start', { apiKey: route.query.apiKey })
                    io.on("telegram_message", (messagesWs) => {

                        setMessage(messagesWs)
                    })
                })
            }

        }


    }, [io, route.query])

    return <>
        <Head>
            <meta name="description" content="wellcome!" />
            <title>{title}</title>
            <meta name="keywords" content="telegram" />
            <meta name="author" content="zack" />
            <link rel="icon" href="./favicon.ico" />

        </Head>
        <div className={styles.content}>
            <AsideMessages messages={messages} />
            <div className={styles.sectionChat}>
                {childrenWithProps}
            </div>
        </div>
    </>
}