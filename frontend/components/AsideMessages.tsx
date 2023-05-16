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
    faChessKing

} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import Iuser from '@/interfaces/Iuser';
import getUserInfo from '@/services/userInfo';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

type MessagesTel = {
    name: string,
    messages: {
        type: string,
        text?: string,
        urlMedia?: string,
    }[]
    profile: string,
    id: number
}
function generatePreview(message: { type: string, text?: string, urlMedia?: string }) {
    const { type, text, urlMedia } = message
    if(text){

        const format = text.length >= 50 ? text.substring(0, 50) + '...' : text
        return format
    }
}
export default function AsideMessages({ messages }: { messages: MessagesTel[] }) {
    const route = useRouter()
    const [userInfo, setUserInfo] = useState<Iuser>()
    const [isNoturne, setNoturne] = useState<boolean>()

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
            <div className={styles.userinfo}>
                <div className={styles.profile}>
                    <Image src={userInfo?.profile || load} alt="your profile" width={100} height={100} />
                </div>
                <br />
                {userInfo?.days_use ? <span>{userInfo.adm ? <><FontAwesomeIcon icon={faChessKing} width={16} height={16} /><strong>adm</strong><FontAwesomeIcon icon={faChessKing} width={16} height={16} /></> : `Days of use: ${userInfo.days_use}`}</span> : <span className={styles.loadText}></span>}

                <h3>{userInfo?.name || <span className={styles.loadText}></span>} </h3>


            </div>
            <div className={styles.botProfileChat}>
                <Image width={60} src={genericProfile} alt=""/>
                <span>bot name</span>
            </div>
            <ul className={styles.chatBarr}>
                {messages.map((value, key) =>
                    <li key={key}>
                        <Image src={value.profile || genericProfile} width={50} height={50} alt="contanct" />
                        <div>
                            <span className={styles.nameChat}>{value.name}</span>
                            <p className={styles.lastmessage}>{generatePreview(value.messages[value.messages.length - 1])}</p>

                        </div>
                        <div className={styles.messageCount}><span>{value.messages.length}</span></div>
                    </li>

                )}



            </ul>
        </div>
    </>
}