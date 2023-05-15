import LayoutChat from "@/components/chatLayout"
import { useSocket } from "@/hooks/useSocket"
import TelBot from "@/interfaces/ItelBot"
import { getBotForId } from "@/services/botInfo"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"

export default function Chat() {






    return <>
        <LayoutChat title="chat">
            <>
                <h1>Use the chat to converse and trigger flows.</h1>

            </>
        </LayoutChat>
    </>
}