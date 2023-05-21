import styles from '@/styles/Home.module.css'
import Head from 'next/head'
import AsideMessages from './AsideMessages'
import { useSocket } from '@/hooks/useSocket'
import { useRouter } from 'next/router'
import { cloneElement, useEffect, useState } from 'react'
import React from 'react'
import { getBotForId } from '@/services/botInfo'
import TelBot from '@/interfaces/ItelBot'
export default function LayoutChat({ children, title }: { title: string, children: JSX.Element }) {
    const io = useSocket('localhost:8081')
    const route = useRouter()
    const [botInfo, setBotInfo] = useState<TelBot>()



    const [messages, setMessage] = useState<MessagesTel[]>([])

    const childrenWithProps = React.Children.map(children, (child) =>
        cloneElement(child, { io, messages })
    );
    useEffect(() => {
        if (typeof route.query.apiKey == 'string') {

            if (io) {
                io.on("connect", () => {
                  
                    route.reload()   
                })
                
                io.on("close",()=>{
                    route.push("/user/mybots")
                })        
                io.on("telegram_message", (messagesWs) => {
                    
                    setMessage(messagesWs)
                })
                
                io.emit('bot_start', { apiKey: route.query.apiKey })
            }

        }

        if (typeof route.query.id == 'string') {

            getBotForId(route.query.id).then((res) => {
                if (res.status == '200') {

                    setBotInfo(res.data.data)

                } else {
                    route.push('/404')
                }

            })
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
            <AsideMessages messages={messages} botInfo={botInfo} />
            <div className={styles.sectionChat}>
                {childrenWithProps}
            </div>
        </div>
    </>
}