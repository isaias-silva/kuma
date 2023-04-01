import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import load from '../public/load.gif'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit,
    faContactCard,
    faMessage,
    faPeopleGroup,
    faDashboard,
    faDeleteLeft,
    faRobot, faMoon, faSun

} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import Iuser from '@/interfaces/Iuser';
import getUserInfo from '@/services/userInfo';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';


export default function Aside() {
    const route = useRouter()
    const [userInfo, setUserInfo] = useState<Iuser>()
    const [isNoturne, setNoturne] = useState<boolean>()

    useEffect(() => {
        //is noturne
        const theme=Cookies.get('theme-dark')
        if(theme && typeof document!="undefined"){
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
        <div className={styles.aside}>
            <button className={styles.controlTheme}><FontAwesomeIcon icon={isNoturne ? faSun : faMoon}
                width={25}
                height={25}
                onClick={setTheme}
            /></button>
            <div className={styles.userinfo}>
                <div className={styles.profile}>
                    <Image src={userInfo?.profile || load} alt="your profile" width={100} height={100} />
                </div>
                <h3>{userInfo?.name}</h3>
                <span>days of use: {userInfo?.days_use}</span>
            </div>
            <ul>
                <li>
                    <Link href={'/user/profile'}><FontAwesomeIcon icon={faEdit} width={20} />   edit profile</Link>
                </li>
                <li>
                    <Link href={'/user'}> <FontAwesomeIcon icon={faRobot} width={20} />my bots</Link>
                </li>
                <li>
                    <Link href={'/user'}><FontAwesomeIcon icon={faMessage} width={20} />   create flux</Link>
                </li>
                <li>
                    <Link href={'/user'}> <FontAwesomeIcon icon={faContactCard} width={20} /> contact list</Link>
                </li>
                <li>
                    <Link href={'/user'}> <FontAwesomeIcon icon={faPeopleGroup} width={20} /> atendants list</Link>
                </li>
                <li>
                    <Link href={'/user'}> <FontAwesomeIcon icon={faDashboard} width={20} />dash board</Link>
                </li>

                <li>
                    <button onClick={() => {
                        Cookies.remove('token')
                        route.push('/login')
                    }}> <FontAwesomeIcon icon={faDeleteLeft} width={30}

                        />logout</button>
                </li>
            </ul>
        </div>
    </>
}