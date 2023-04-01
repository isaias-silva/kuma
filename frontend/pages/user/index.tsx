import TypingText from "@/components/TypingText"
import LayoutUser from "@/components/userLayout"
import styles from '@/styles/Home.module.css'



export default function Home() {

  return (

    <>
      <LayoutUser title="user page">
        <>
          <h1>wellcome!</h1>
          <TypingText text="Welcome to Kuma! A Telegram automation platform! Use it for customer service, leisure, and whatever your mind can imagine"
            typingDelay={10}
          />


          <div className={styles.blocks}>
            <div className={styles.block}>

            </div>

            <div className={styles.block}>
              <h4>bots: </h4>
            </div>
            <div className={styles.block}>
              <h4>flow: </h4>
            <p>
            Flow is a pre-programmed message sequence that directs a conversation or customer service interaction. It includes prompts for information, questions, or options to guide the interaction towards a specific outcome. Flow creates a structured communication allowing for efficient and effective conversation between a service provider and customer. Following a predetermined flow ensures the provider addresses the customer's needs in an organized and timely manner, resulting in a positive customer experience.
            </p>
            </div>
            <div className={styles.block}>
              <h4>contact list: </h4>
            </div>
            <div className={styles.block}>
              <h4>attendants list:</h4>
            </div>


          </div>
        </>
      </LayoutUser></>
  )
}
