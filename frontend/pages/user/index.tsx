import TypingText from "@/components/TypingText"
import LayoutUser from "@/components/userLayout"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faDatabase, faContactCard, faContactBook, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';


import styles from '@/styles/Home.module.css'
import Graph from "@/components/graph";



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
              <p>Track the performance of bot support on the dashboard.</p>
              <Graph />
            </div>

            <div className={styles.block}>
              <h4>  bots: </h4>
              <FontAwesomeIcon icon={faRobot} width={100} height={100} />
              <p>create your chat bots for service and interaction.</p>
            </div>
            <div className={styles.block}>
              <h4>flow: </h4>
              <FontAwesomeIcon icon={faDatabase} width={100} height={100} />
              <p>create conversation flows with different conversation paths with the user.</p>

            </div>
            <div className={styles.block}>
              <h4>contact list: </h4>
              <FontAwesomeIcon icon={faContactCard} width={100} height={100} />
              <p>create a list of your customers</p>
            </div>
            <div className={styles.block}>
              <h4>attendants list:</h4>
              <FontAwesomeIcon icon={faPeopleGroup} width={100} height={100} />
              <p>create a list of attendants to assist the chatbot service</p>
            </div>


          </div>
        </>
      </LayoutUser></>
  )
}
