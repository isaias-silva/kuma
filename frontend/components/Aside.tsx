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
    faRobot

} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Iuser from '@/interfaces/Iuser';
import getUserInfo from '@/services/userInfo';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';


export default function Aside() {
    const route = useRouter()
    const [userInfo, setUserInfo] = useState<Iuser>()
    useEffect(() => {
        getUserInfo().then(res => {
            if (res.status == 200) {
                const { data } = res.data
                setUserInfo(data)
            } else {
                route.push('/login')
            }
        }).catch((err) => console.log(err))
    }, [])
    return <>
        <div className={styles.aside}>
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