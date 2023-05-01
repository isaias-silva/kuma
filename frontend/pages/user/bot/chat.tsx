import { useSocket } from "@/hooks/useSocket"
import TelBot from "@/interfaces/ItelBot"
import { getBotForId } from "@/services/botInfo"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Chat() {
    
    const io = useSocket('localhost:8081')


    const route = useRouter()


    useEffect(() => {
        if (typeof route.query.apiKey == 'string') {

            if (io) {
                io.on('connect', () => {
                    io.emit('bot_start', { apiKey: route.query.apiKey })
                })
            }

        } 

        
    }, [io,route.query])





    return <>
        <h1>never</h1>
    </>
}