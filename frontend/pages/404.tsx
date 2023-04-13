import styles from '@/styles/Home.module.css'

import Cookies from 'js-cookie'
import Link from 'next/link'
import { useEffect } from 'react'
import notFoundImage from '@/public/not_found.png'
import Image from 'next/image'

export default function NotFound() {
    useEffect(() => {
        const theme = Cookies.get('theme-dark')
        if (theme && typeof document != "undefined") {

            document.body.classList.add('dark-mode')
        }
    })
    return <>
        <div className={styles.errorPage}>
            <h1>page not found</h1>
    <Image src={notFoundImage} alt="not found" width={150} height={150}/>
            <p>the page not found</p>
            <Link href={'/'}>return</Link>
        </div>

    </>
}