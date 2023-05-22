import TypingText from "@/components/TypingText"
import ChatComponent from "@/components/chatComponent"
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
            <ChatComponent />
        </LayoutChat>
    </>
}