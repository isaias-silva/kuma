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
type editControl = {
  editBotName: boolean,
  editTelegramName: boolean,
  editProfile: boolean
}
type UpdateBotData = {
  name: string;
  telegram_name: string;
  profile: FileList
};
export default function Bot() {

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateBotData>();

  const onSubmit = (data: UpdateBotData) => {
    alert(data.name)

  }

  const validateBotName = (botName: string) => {
    let error;
    if (botName?.length <= 3) {
      error = "bot name is short, please use 4 digits or more."
    }
    return error
  }
  const validateBotTelegramName = (telegramBotName: string) => {
    let error;
    if (telegramBotName?.length <= 3) {
      error = "telegram bot name is short, please use 4 digits or more."
    }
    return error
  }
  const route = useRouter()
  const [bot, setBot] = useState<TelBot>()
  const [botName, setBotName] = useState<string>()
  const [telegramBotName, setTelegramBotName] = useState<string>()
  const [profileImg, setProfileImg] = useState<string>()



  const [editMode, setEditMode] = useState<editControl>()

  useEffect(() => {


    if (typeof route.query.id == 'string') {

      getBotForId(route.query.id).then((res) => {
        if (res.status == '200') {
          if (!botName || !telegramBotName) {
            setBotName(res.data.data.name)
            setTelegramBotName(res.data.data.telegram_name)
          }
          setBot(res.data.data)

        } else {

          console.log(res)
          route.push('/404')
        }

      })
    }
  }, [bot])
  const changeBotName = (ev: any) => {
    if (ev && typeof ev.target.value == "string") {
      setBotName(ev.target.value)
    }
  }
  const changeTelegramBotName = (ev: any) => {
    if (ev && typeof ev.target.value == "string") {
      setTelegramBotName(ev.target.value)
    }
  }
  function changeImage(ev: any) {
    const file = ev.target.files[0]

    if (!file) {
      return
    }
    if (!file.type.includes("image")) {
      setProfileImg(corrupted.src)
    } else {

      setProfileImg(URL.createObjectURL(ev.target.files[0]))
    }

  }



  function activeEditMode(key: 'telBotName' | 'botName', value: boolean) {

    const control: editControl = {
      editBotName: editMode?.editBotName || false,
      editTelegramName: editMode?.editTelegramName || false,
      editProfile: editMode?.editProfile || false
    }
    if (key == 'telBotName') {
      control.editTelegramName = value
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
              <div className={styles.profileEdit}>
                <label htmlFor="profile">
                  <Image src={profileImg || bot?.profile || loadImg} width={150} height={150} alt="select your profile"></Image>
                </label>

                <input id="profile"
                  type='file'
                  {...register("profile", {})}
                  onInput={changeImage}
                />


              </div>
              <button onClick={handleSubmit(onSubmit)}>update profile</button>
            </div>
            <div className={styles.botInfo}>
              <ul>
                <li>
                  <strong>bot name: </strong> {editMode?.editBotName ?
                    <input type="text" value={botName}
                      onInput={changeBotName}
                      {...register("name", { validate: validateBotName })} /> : bot?.name || <span className={styles.loadText}></span>}

                      
                  <button onClick={() => { activeEditMode('botName', !editMode?.editBotName) }}>

                    <FontAwesomeIcon icon={editMode?.editBotName ? faSave : faEdit} width={16} height={16} />
                  </button>
                </li>
                <li>
                  <strong>telegram name: </strong> {editMode?.editTelegramName ?
                    <input type="text" value={telegramBotName}

                      onInput={changeTelegramBotName}

                      {...register("telegram_name", { validate: validateBotTelegramName })} />
                    : bot?.telegram_name || <span className={styles.loadText}></span>}

                  <button onClick={() => { activeEditMode('telBotName', !editMode?.editTelegramName) }}>

                    <FontAwesomeIcon icon={editMode?.editTelegramName ? faSave : faEdit} width={16} height={16} />
                  </button>
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
            {errors.name?<span className={styles.error}>{errors.name.message}</span>:null}
            {errors.telegram_name?<span className={styles.error}>{errors.telegram_name.message}</span>:null}
            {errors.profile?<span className={styles.error}>{errors.profile.message}</span>:null}
        </>
      </LayoutUser>
    </>
  )
}