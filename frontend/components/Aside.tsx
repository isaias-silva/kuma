import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import logo from '../public/login.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit,
    faContactCard,
    faMessage,
    faPeopleGroup,
    faDashboard
} from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function Aside() {
    return <>
        <div className={styles.aside}>
            <div className={styles.userinfo}>
                <div className={styles.profile}>
                    <Image src={logo} alt="your profile" />
                </div>
                <h3>name</h3>
                <span>days of use: {2}</span>
            </div>
            <ul>
                <li>
                    <Link href={'/user'}><FontAwesomeIcon icon={faEdit} />   edit profile</Link>
                </li>

                <li>
                    <Link href={'/user'}><FontAwesomeIcon icon={faMessage} />   create flux</Link>
                </li>
                <li>
                    <Link href={'/user'}> <FontAwesomeIcon icon={faContactCard} /> contact list</Link>
                </li>
                <li>
                    <Link href={'/user'}> <FontAwesomeIcon icon={faPeopleGroup} /> atendants list</Link>
                </li>
                <li>
                    <Link href={'/user'}> <FontAwesomeIcon icon={faDashboard} />dash board</Link>
                </li>
            </ul>
        </div>
    </>
}