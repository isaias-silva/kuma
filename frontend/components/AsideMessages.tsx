import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import load from '@/public/load.gif'
import genericProfile from '@/public/login.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMoon,
    faSun,
    faCrow,
    faDiamond,
    faBiking,
    faChessKing,
    faTentArrowTurnLeft,
    faRobot

} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import Iuser from '@/interfaces/Iuser';
import getUserInfo from '@/services/userInfo';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import TelBot from '@/interfaces/ItelBot';


function generatePreview(message: { type: string, text?: string, urlMedia?: string }) {
    const { type, text, urlMedia } = message
   if(text){

       if (type == 'text') {
   
           const format = text.length >= 50 ? text.substring(0, 20) + '...' : text
           return format
       } else {
           return `[${type}] ${ text.length >= 50 ? text.substring(0, 8) + '...' : text}`
       }
   }else{
    return `[${type}]`
   }
}
export default function AsideMessages({ messages, botInfo }: { botInfo?: TelBot, messages: MessagesTel[] }) {
    const route = useRouter()
    const [userInfo, setUserInfo] = useState<Iuser>()
    const [isNoturne, setNoturne] = useState<boolean>()
    const [urlReturn, setUrlReturn] = useState<string>('/user/mybots')
    useEffect(() => {

        //is noturne
        const theme = Cookies.get('theme-dark')
        if (theme && typeof document != "undefined") {
            setNoturne(true)
            document.body.classList.add('dark-mode')
        }
        //userinfo
        getUserInfo().then(res => {
            if (res.status == 200) {
                const { data } = res.data
                setTimeout(() => { setUserInfo(data) }, 2000)

            } else {
                route.push('/login')
            }
        }).catch((err) => console.log(err))
    }, [])

    function setTheme() {

        const newValue = !isNoturne
        setNoturne(newValue)
        if (newValue == true) {
            document.body.classList.add("dark-mode");
            Cookies.set('theme-dark', 'on')
        } else {
            document.body.classList.remove("dark-mode");
            Cookies.remove('theme-dark')
        }


    }
    return <>
        <div className={styles.asideChat}>
            <button onClick={setTheme} className={styles.controlTheme}><FontAwesomeIcon icon={isNoturne ? faSun : faMoon}
                width={25}
                height={25}

            /></button>
            <Link href={`/user/bot/${botInfo?._id}`} className={styles.btnLeft}>
                <FontAwesomeIcon icon={faRobot} width={25} height={25} />
            </Link>
            <Link href={'/user'}>
                <div className={styles.userinfo}>
                    <div className={styles.profile}>
                        <Image src={userInfo?.profile || load} alt="your profile" width={100} height={100} />
                    </div>
                </div>
            </Link>

            <div className={styles.botProfileChat}>
                <Image
                    src={botInfo?.profile || genericProfile}
                    width={60}
                    height={60}
                    alt="bot profile profile" />
                {botInfo ? <span>{botInfo.name} </span> : <span className={styles.loadText}></span>}
            </div>

            <ul className={styles.chatBarr}>
                {messages.map((value, key) =>
                    <li key={key}>
                        {value.isGroup ?
                            <div>
                                <Image className={styles.groupProfile}
                                    src={value.profile || genericProfile}
                                    width={50}
                                    height={50}
                                    alt="group" />

                                <Image className={styles.memberGroup}
                                    src={value.messages[value.messages.length - 1].groupChatInfo?.profile
                                        || genericProfile}
                                    width={30}
                                    height={30}
                                    alt="contanct" />

                            </div>
                            :
                            <Image src={value.profile || genericProfile} width={50} height={50} alt="contanct" />
                        }

                        <div>
                            <span className={styles.nameChat}>{value.name}</span>
                            <p className={styles.lastmessage}>
                                {value.isGroup ? <b>{value.messages[value.messages.length - 1].groupChatInfo?.name}: </b> : ''}
                                {generatePreview(value.messages[value.messages.length - 1])}</p>

                        </div>
                        <div className={styles.messageCount}><span>{value.messages.length}</span></div>
                    </li>

                )}



            </ul>
        </div>
    </>
}