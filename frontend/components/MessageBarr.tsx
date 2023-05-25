import styles from '@/styles/Home.module.css'
import { faMicrophone, faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Socket } from 'socket.io-client'
export default function MessageBarr({ io }: { io?: Socket }) {
    const [message, setMessage] = useState<string>()
    const [opt, setOpt] = useState<'text' | 'media' | 'doc' | 'audio'>('audio')
    return <div className={styles.chatForm}>
       
        <button><FontAwesomeIcon icon={faPaperclip} width={20} height={20} /></button>

        <textarea value={message} onChange={(ev) => { setMessage(ev.target.value) }}></textarea>

        <button><FontAwesomeIcon icon={message ? faPaperPlane : faMicrophone} width={20} height={20} /></button>

    </div>
}