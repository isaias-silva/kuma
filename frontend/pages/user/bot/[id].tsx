import { useRouter } from "next/router"
import styles from '@/styles/Home.module.css'
import LayoutUser from "@/components/userLayout"
import { useEffect, useState } from "react"
import { getBotForId } from "@/services/botInfo"
import TelBot from "@/interfaces/ItelBot"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons"
import loadImg from '@/public/load.gif'
import corrupted from '@/public/corrupted.png'
import { useForm } from "react-hook-form"
import { updateBotName, updateProfileBot } from "@/services/updateTelegramBotInfo"
type editControl = {
  editBotName: boolean,

}
type UpdateBotData = {
  name: string;
};
export default function Bot() {
  const route = useRouter()
  const [bot, setBot] = useState<TelBot>()
  const [botName, setBotName] = useState<string>()

  const [editMode, setEditMode] = useState<editControl>()
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateBotData>();


  const onSubmit = async (data: UpdateBotData) => {
    if (bot?.apiKey) {
      if (data.name) {
        const newValue = { editBotName: false }
        setEditMode(newValue)
        const response = await updateBotName(data.name, bot?.apiKey)
        if (response.status == 200) {
          alert('vitoria')
        } else {
          alert('erro')
        }
      }


    }
  }

  const validateBotName = (botName: string) => {
    let error;
    if (botName && botName?.length <= 3) {
      error = "bot name is short, please use 4 digits or more."
    }
    return error
  }



  useEffect(() => {

    if (typeof route.query.id == 'string') {

      getBotForId(route.query.id).then((res) => {
        if (res.status == '200') {
          if (!botName) {
            setBotName(res.data.data.name)
          }
          setBot(res.data.data)

        } else {

          console.log(res)
          route.push('/404')
        }

      })
    }
  }, [route.query])
  const changeBotName = (ev: any) => {
    if (ev && typeof ev.target.value == "string") {
      setBotName(ev.target.value)
    }
  }




  function activeEditMode(key: 'botName', value: boolean) {

    const control: editControl = {
      editBotName: editMode?.editBotName || false,

    }

    if (key == 'botName') {
      control.editBotName = value
    }
    setEditMode(control)
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
                  <strong>bot name: </strong> {editMode?.editBotName ?
                    <input type="text" value={botName}
                      onInput={changeBotName}
                      {...register("name", { validate: validateBotName })} /> : botName || bot?.name || <span className={styles.loadText}></span>}


                  <button onClick={editMode?.editBotName ? handleSubmit(onSubmit) : () => {

                    activeEditMode('botName', !editMode?.editBotName)
                  }}>

                    <FontAwesomeIcon icon={editMode?.editBotName ? faSave : faEdit} width={16} height={16} />
                  </button>
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
                  <strong>messages:</strong> {bot?.messages.length}

                </li>
              </ul>
            </div>
          </div>
          {errors.name ? <span className={styles.error}>{errors.name.message}</span> : null}
        </>
      </LayoutUser>
    </>
  )
}