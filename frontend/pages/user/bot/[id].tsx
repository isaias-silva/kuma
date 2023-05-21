import { useRouter } from "next/router"
import styles from '@/styles/Home.module.css'
import LayoutUser from "@/components/userLayout"
import { useEffect, useState } from "react"
import { getBotForId } from "@/services/botInfo"
import TelBot from "@/interfaces/ItelBot"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faPlus, faSave, faTrash, faMessage } from "@fortawesome/free-solid-svg-icons"
import loadImg from '@/public/load.gif'

import { useForm } from "react-hook-form"
import { updateBotName } from "@/services/updateTelegramBotInfo"

import DefaultConfigModal from "@/utils/generateConfigModal"
import { deleteCommandTelBot, deleteTelBot } from "@/services/deleteBot"
import CreateCommandForm from "@/components/createCommandForm"
import TypingText from "@/components/TypingText"
type editControl = {
  editBotName: boolean,
  createCommand: boolean
}
type UpdateBotData = {
  name: string;
};
export default function Bot() {
  const route = useRouter()
  const [bot, setBot] = useState<TelBot>()
  const [deleting, setDeleting] = useState<boolean>(false)
  const [botName, setBotName] = useState<string>()

  const [editMode, setEditMode] = useState<editControl>({
    editBotName: false,
    createCommand: false,
  })


  const { register, handleSubmit, formState: { errors } } = useForm<UpdateBotData>();




  useEffect(() => {

    if (typeof route.query.id == 'string') {

      getBotForId(route.query.id).then((res) => {
        if (res.status == '200') {

          setBot(res.data.data)

        } else if (!deleting) {

          DefaultConfigModal({ text: 'bot not found', title: 'error', icon: 'error' }).fire().then((click) => {

            route.push('/user/mybots')
          })
        }

      })
    }
  }, [route.query, bot])
  const changeBotName = (ev: any) => {
    if (ev && typeof ev.target.value == "string") {
      setBotName(ev.target.value)
    }
  }




  function activeEditMode(key: 'botName' | 'command', value: boolean) {


    const control: editControl = {
      editBotName: editMode?.editBotName,
      createCommand: editMode?.createCommand,
    }

    if (key === 'botName') {
      control.editBotName = value
    }
    else if (key === 'command') {
      control.createCommand = value

    }
    setEditMode(control)
  }

  const deleteBot = async () => {
    if (!bot) {
      return
    }
    setDeleting(true)
    DefaultConfigModal({ text: ' ', title: ' ', icon: 'success' }).showLoading()

    const response = await deleteTelBot(bot._id)

    if (response.status == 200) {
      DefaultConfigModal({ text: response.data.message, title: 'success', icon: 'success' }).fire().then((click) => {

        route.push('/user/mybots')
      })

    } else {
      DefaultConfigModal({ text: response.data.message, title: response.status, icon: 'error' }).fire()

    }
  }
  const deleteCommand = async (command: string) => {
    if (!bot) {
      return
    }
    DefaultConfigModal({ text: ' ', title: ' ', icon: 'success' }).showLoading()

    const response = await deleteCommandTelBot(bot.apiKey, command)
    if (response.status == 200) {


      DefaultConfigModal({ text: response.data.message, title: "success", icon: 'success' }).fire()

    } else {
      DefaultConfigModal({ text: response.data.message, title: response.status, icon: 'error' }).fire()

    }

  }


  return (
    <>
      <LayoutUser title={bot?.name || 'bot'}>
        <>
          <h1>{bot?.name || <span className={styles.loadText}></span>}</h1>
          <div className={styles.botDiv}>
            <div className={styles.centeredDiv}>
              <div>

                <Image className={styles.profile}
                  src={bot?.profile || loadImg}
                  width={200}
                  height={200}
                  alt="bot profile profile"></Image>

              </div>

            </div>
            <div className={styles.botInfo}>
              <ul>
                <li>
                  <strong>bot name: </strong>  {bot?.name || <span className={styles.loadText}></span>}
                </li>
                <li>
                  <strong>telegram name: </strong> {bot?.telegram_name || <span className={styles.loadText}></span>}
                </li>
                <li>
                  <strong>telegram id: </strong> {bot?.bot_id || <span className={styles.loadText}></span>}

                </li>
                <li>
                  <strong>api key: </strong> {bot?.apiKey || <span className={styles.loadText}></span>}

                </li>
                <li>
                  <strong>telegram id: </strong> {bot?.bot_id || <span className={styles.loadText}></span>}

                </li>

                <li>
                  <button onClick={deleteBot}><FontAwesomeIcon icon={faTrash} width={12} /> delete bot</button>
                  <button onClick={() => {
                    route.push(`chat/?apiKey=${bot?.apiKey}&id=${bot?._id}`)
                  }}><FontAwesomeIcon icon={faMessage} width={15} /> chat
                    {bot?.messages && bot.messages.length > 0 ?<span className={styles.countMsgBtn}>{bot.messages.length}</span>:''}
                  </button>
                </li>
              </ul>

            </div>
          </div>
          {errors.name ? <span className={styles.error}>{errors.name.message}</span> : null}

          <TypingText text="We'd like to clarify that even if you delete the bot here, it will still exist on Telegram. Our bot is available on the Telegram platform as well, so you can continue interacting with it there. Simply search for our bot by name or identifier in the Telegram search bar to start a conversation and access all its features. We're committed to providing ongoing support across different platforms to meet your needs. Thank you for your understanding." typingDelay={5} />

          <div className={styles.comands}>
            <h2>commands:</h2>

            <ul>

              {
                editMode?.createCommand.valueOf() == true ? <CreateCommandForm callback={() => { activeEditMode('command', false) }} apiKey={bot?.apiKey} /> : <li>

                  <div className={styles.createCommand}
                    onClick={() => { activeEditMode('command', true) }}
                  >

                    <FontAwesomeIcon icon={faPlus} width={24} />
                  </div>
                </li>

              }


              {bot && bot?.comands.length > 0 ?
                <>{bot.comands.map((item, key) => {
                  return <li key={key}>
                    <strong>/{item.command}</strong>
                    <div className={styles.explanation}>
                      <p>{item.description}</p>
                    </div>
                    <select name="flow vinculated">
                      <option> select flow of command</option>
                      <option value="flow 1"> flow 1</option>
                      <option value="flow 2"> flow 2</option>
                      <option value="flow 3"> flow 3</option>
                      <option value="flow 4"> flow 4</option>
                      <option value="flow 5"> flow 5</option>
                      <option value="flow 6"> flow 6</option>
                    </select>
                    <div className={styles.control}>
                      <button onClick={() => {
                        deleteCommand(item.command)

                      }}><FontAwesomeIcon icon={faTrash} width={24} height={24} /></button>

                    </div>
                  </li>

                })}
                </>
                :
                <p>commands not found.</p>
              }

            </ul>
          </div>


        </>
      </LayoutUser>
    </>
  )
}