import { useRouter } from "next/router"
import styles from '@/styles/Home.module.css'
import LayoutUser from "@/components/userLayout"
import { useState } from "react"
import { getBotForId } from "@/services/botInfo"
import TelBot from "@/interfaces/ItelBot"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons"
import loadImg from '@/public/load.gif'
import corrupted from '@/public/corrupted.png'
type editControl = {
  editBotName: boolean,
  editTelegramName: boolean,
  editProfile: boolean
}

export default function Bot() {



  const route = useRouter()
  const [bot, setBot] = useState<TelBot>()

  const [profileImg, setProfileImg] = useState<string>()
  const [newName, setNewName] = useState<string>()
  const [newTelName, setNewTelName] = useState<string>()

  const [editMode, setEditMode] = useState<editControl>()


  if (typeof route.query.id == 'string') {

    getBotForId(route.query.id).then((res) => {
      if (res.status == '200') {
        setBot(res.data.data)
      } else {

        console.log(res)
        route.push('/404')
      }

    })
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
                  onInput={changeImage}
                />


              </div>
              <button>update profile</button>
            </div>
            <div className={styles.botInfo}>
              <ul>
                <li>
                  <strong>bot name: </strong> {editMode?.editBotName ?
                    <input type="text" value={newName || bot?.name} /> : bot?.name || <span className={styles.loadText}></span>}


                  <button onClick={() => { activeEditMode('botName', !editMode?.editBotName) }}>

                    <FontAwesomeIcon icon={editMode?.editBotName ? faSave : faEdit} width={16} height={16} />
                  </button>
                </li>
                <li>
                  <strong>telegram name: </strong> {editMode?.editTelegramName ?
                    <input type="text" value={newTelName || bot?.telegram_name} />
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
        </>
      </LayoutUser>
    </>
  )
}