import TypingText from "@/components/TypingText";
import LayoutUser from "@/components/userLayout";
import styles from '@/styles/Home.module.css'
import Link from "next/link";

export default function Mybots() {

    return <LayoutUser title="edit your profile">
        <>
            <h1>my bots</h1>
            <TypingText text="your valid robots"
                typingDelay={10}
            />
            <div className={styles.blocks}>
                <Link href={'/bot/aodsdas'} className={styles.block_normal}>
                    <h3>name bot</h3>
                    <p>key:</p>
                    <p>messages: </p>
                    <p>abuble </p>
                </Link>
             
            </div>
        </>
    </LayoutUser>
}