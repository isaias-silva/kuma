import TypingText from "@/components/TypingText";
import LayoutUser from "@/components/userLayout";
import styles from '@/styles/Home.module.css'
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import getMyBots from "@/services/botInfo";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import CreateBotForm from "@/components/createBotForm";


type TelBot = {
    profile: string,
    name: string,
    telegram_name: string,
    ownerId: string
    apiKey: string
    messages: [],
    bot_id: number
}

export default function Mybots() {
    const [bots, setBots] = useState<TelBot[]>([])
    useEffect(() => {
        getMyBots().then((res) => { setBots(res.data.data) }).catch((err) => { alert('ui') })
    }, [])

    const botsComponent = bots.map((bot) => {

        return <Link href={`/bot/${bot.bot_id}`} className={styles.block_normal}>
            <Image src={bot.profile} width={150} height={150} alt="profile" />
            <h3>{bot.name}</h3>

            <p>{bot.telegram_name}</p>
            <p>messages:{bot.messages.length} </p>

        </Link>

    })
    return <LayoutUser title="edit your profile">
        <>
            <h1>my bots</h1>
            <TypingText text={bots.length > 0 ? `your valid bots: ${bots.length}` : `no valid bot created, create your bots with telegram api key`}
                link={bots.length > 0 ? null: "https://web.telegram.org/k/#@BotFather"}
                typingDelay={10}
            />
            <CreateBotForm />
           
            <div className={styles.blocks}>
                {botsComponent}
            </div>
        </>
    </LayoutUser>
}