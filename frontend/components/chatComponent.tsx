import TypingText from "@/components/TypingText"
import LayoutChat from "@/components/chatLayout"
import { useSocket } from "@/hooks/useSocket"
import TelBot from "@/interfaces/ItelBot"
import { getBotForId } from "@/services/botInfo"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styles from '@/styles/Home.module.css'
import corrupted from '../public/corrupted.png'
import { Socket } from "socket.io-client"
import Image from "next/image"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperclip,faMicrophone } from "@fortawesome/free-solid-svg-icons"

function createDivMessage(message: MessagesTel["messages"]) {
    const divMessages = message.map(value => {
        switch (value.type) {
            case "video":
                return <div className={styles.msg}>
                    <div className={styles.videoContent}>
                        {value.groupChatInfo ? <h4>{value.groupChatInfo.name}: </h4> : null}
                        <video src={value.urlMedia} controls>

                        </video>
                        <p>{value.text}</p>
                    </div>
                </div>
            case "image":
                return <div className={styles.msg}>
                    <div className={styles.imageContent}>
                        {value.groupChatInfo ? <h4>{value.groupChatInfo.name}: </h4> : null}

                        <Image src={value.urlMedia || corrupted}
                            width={300}
                            height={300}
                            alt="image"></Image>


                        <p>{value.text}</p>
                    </div>
                </div>
            case "audio":
                return <div className={styles.msg}>
                    {value.groupChatInfo ? <h4>{value.groupChatInfo.name}: </h4> : null}

                    <audio src={value.urlMedia} controls></audio>

                    <p>{value.text}</p>
                </div>
            case "doc":
                return <div className={styles.msg}>
                    {value.groupChatInfo ? <h4>{value.groupChatInfo.name}: </h4> : null}

                    {value.urlMedia ? <Link href={value.urlMedia} download>file</Link> : null}
                    <p>{value.text}</p>
                </div>
            case "sticker":
                return <div className={styles.msg}>
                    <div className={styles.stickerContent}>
                        {value.groupChatInfo ? <h4>{value.groupChatInfo.name}: </h4> : null}

                        <Image src={value.urlMedia || corrupted}
                            width={150}
                            height={220}
                            alt="image"></Image>
                    </div>
                </div>
            case "text":
                return <div className={styles.msg}>
                    {value.groupChatInfo ? <h4>{value.groupChatInfo.name}: </h4> : null}

                    <p>{value.text}</p>
                </div>


        }
    })
    return divMessages
}

export default function ChatComponent({ io, messages }: { io?: Socket, messages?: MessagesTel[] }) {
    const route = useRouter()
    const [youMessage, setYouMessage] = useState<MessagesTel | undefined>()
    useEffect(() => {
        if (io) {

        }
        if (messages && messages.length > 0 && typeof route.query.user == "string") {
            const [exists] = messages.filter((value) => value.id.toString() == route.query.user)
            if (exists) {
                setYouMessage(exists)
            }
        }

    }, [io, messages, route.query])





    return <div className={styles.chatSession}>
        <div className={styles.headerChat}>
            <Image src={youMessage?.profile || corrupted}
                width={50}
                height={50}
                alt="profile-chat"></Image>
            <h2>{youMessage?.name}</h2>
        </div>
        {youMessage ?
            <>
                {createDivMessage(youMessage.messages)}
            </>
            : null}

        <div className={styles.chatForm}>
            <button><FontAwesomeIcon icon={faPaperclip} width={20} height={20}/></button>
           <textarea ></textarea>
            <button><FontAwesomeIcon icon={faMicrophone} width={20} height={20}/></button>
         
         </div>
    </div>
}