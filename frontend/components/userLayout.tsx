import Head from "next/head";
import styles from '@/styles/Home.module.css'
import Aside from "./Aside";


export default function LayoutUser({ children, title }: { title: string, children: JSX.Element }) {

    return <>
        <Head>
            <meta name="description" content="wellcome!" />
            <title>{title}</title>
            <meta name="keywords" content="telegram" />
            <meta name="author" content="zack" />
            <link rel="icon" href="./favicon.ico" />

        </Head>
        <div className={styles.content}>
            <Aside />
            <div className={styles.section}>
                {children}
            </div>
        </div>
    </>
}