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
    faDeleteLeft
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Iuser from '@/interfaces/Iuser';
import getUserInfo from '@/services/userInfo';


export default function Aside() {
    const [userInfo, setUserInfo] = useState<Iuser>()
    useEffect(() => {
        getUserInfo().then(res => setUserInfo(res)).catch(() => alert('aaaai'))
    }, [])
    return <>
        <div className={styles.aside}>
            <div className={styles.userinfo}>
                <div className={styles.profile}>
                    <Image src={userInfo?.profile || load} alt="your profile" width={100} height={100}/>
                </div>
                <h3>{userInfo?.name}</h3>
                <span>days of use: {userInfo?.days_use}</span>
            </div>
            <ul>
                <li>
                    <Link href={'/user/profile'}><FontAwesomeIcon icon={faEdit} width={30} />   edit profile</Link>
                </li>

                <li>
                    <Link href={'/user'}><FontAwesomeIcon icon={faMessage} width={30} />   create flux</Link>
                </li>
                <li>
                    <Link href={'/user'}> <FontAwesomeIcon icon={faContactCard} width={30} /> contact list</Link>
                </li>
                <li>
                    <Link href={'/user'}> <FontAwesomeIcon icon={faPeopleGroup} width={30} /> atendants list</Link>
                </li>
                <li>
                    <Link href={'/user'}> <FontAwesomeIcon icon={faDashboard} width={30} />dash board</Link>
                </li>
                <li>
                    <Link href={'/user'}> <FontAwesomeIcon icon={faDeleteLeft} width={30} />logout</Link>
                </li>
            </ul>
        </div>
    </>
}