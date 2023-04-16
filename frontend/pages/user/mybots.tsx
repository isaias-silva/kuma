import TypingText from "@/components/TypingText";
import LayoutUser from "@/components/userLayout";
import styles from '@/styles/Home.module.css'
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getMyBots } from "@/services/botInfo";

import profile from '../../public/login.png'
import CreateBotForm from "@/components/createBotForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import TelBot from '../../interfaces/ItelBot'





export default function Mybots() {
    const [bots, setBots] = useState<TelBot[]>([])
    const [activeModal, setActiveModal] = useState<boolean>(false)
    useEffect(() => {
        getMyBots().then((res) => { setBots(res.data.data) }).catch((err) => { alert('ui') })
    }, [])

    const botsComponent = bots.map((bot) => {

        return <Link href={`./bot/${bot._id}`} className={styles.block_normal}>
            <Image src={bot.profile || profile.src} 
            width={150} 
            height={150} 
            priority={true}
            alt="profile" />
            <h3>{bot.name}</h3>

            <p>{bot.telegram_name}</p>
            <p>messages:{bot.messages.length} </p>

        </Link>

    })
    return <LayoutUser title="edit your profile">
        <>
     
            <h1>my bots</h1>
            <TypingText text={bots.length > 0 ? `your valid bots: ${bots.length}.` : `no valid bot created`}
                typingDelay={10}
            />
            <p>To create an API key for a bot on Telegram, you can use the Bot Father.
                First, open a chat with the Bot Father and type "/newbot".
                Then, follow the prompts to name your bot and create a username.
                Once your bot is created, the <Link href={"https://t.me/botfather"} target="_blank"> bot father</Link> will provide you with an API key that you can use to access the Telegram API and program your bot.</p>
            <div className={styles[activeModal ? "widowclos" : "invisible"]}>
                <button className={styles.closbtn} onClick={() => { setActiveModal(false) }}>x</button>
                <CreateBotForm />
            </div>
            <div className={styles.blocks}>
                {botsComponent}
                <div className={styles.blockPlus} onClick={() => {
                    setActiveModal(true)
                }}>
                    <FontAwesomeIcon icon={faPlus} width={100} height={100} />
                </div>
            </div>


        </>
    </LayoutUser>
}