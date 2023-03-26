import Head from 'next/head'
import Image from 'next/image'
import logo from '../public/login.png'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
export default function Home() {
  return (
    <>

     <Head>
      <title>wellcome</title>
      <meta name="description" content="automation plataform" />
    </Head>
      <div className={styles.header}>
        <Link href={'/'}>
        <Image src={logo} alt="logo" width={50} height={50}/>
        <h1>Kuma</h1>
        
        </Link>
        <ul>
          <li>
            <Link href={'/'}>login</Link>
          </li>
          <li>
            <Link href={'/'}>prices</Link>
          </li>
          <li>
            <Link href={'/'}>functions</Link>
          </li>
        </ul>
      </div>
      <div className={styles.content}>

      </div>
    </>
  )
}
