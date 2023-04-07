import TypingText from "@/components/TypingText"
import LayoutUser from "@/components/userLayout"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faDatabase, faContactCard, faContactBook, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';


import styles from '@/styles/Home.module.css'
import Graph from "@/components/graph";
import Link from "next/link";

const data = [
  { name: 'Jan', val: { key: 'sell', value: 2000 } },
  { name: 'Fev', val: { key: 'sell', value: 4000 } },
  { name: 'Mar', val: { key: 'sell', value: 6000 } },
  { name: 'Abril', val: { key: 'sell', value: 8000 } },
  { name: 'Maio', val: { key: 'sell', value: 2000 } },
  { name: 'Jun', val: { key: 'sell', value: 1000 } },
];

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
              <p>Track the performance of bot support on the <Link href={'/user/dashboard'}>dashboard</Link></p>
              <Graph dataKey="sell" data={data}/>
            </div>

            <div className={styles.block}>
              <h4>  bots: </h4>
              <FontAwesomeIcon icon={faRobot} width={100} height={100} />
              <p>create your chat <Link href={'/user/mybots'}>bots</Link> for service and interaction.</p>
            </div>
            <div className={styles.block}>
              <h4>flow: </h4>
              <FontAwesomeIcon icon={faDatabase} width={100} height={100} />
              <p>create conversation <Link href={'/user/flows'}>flows</Link> with different conversation paths with the user.</p>

            </div>
            <div className={styles.block}>
              <h4>contact list: </h4>
              <FontAwesomeIcon icon={faContactCard} width={100} height={100} />
              <p>create a <Link href={'/user/contacts'}>list</Link> of your customers</p>
            </div>
            <div className={styles.block}>
              <h4>attendants list:</h4>
              <FontAwesomeIcon icon={faPeopleGroup} width={100} height={100} />
              <p>create a list of <Link href={'/user/dashboard'}>attendants</Link> to assist the chatbot service</p>
            </div>


          </div>
        </>
      </LayoutUser></>
  )
}
