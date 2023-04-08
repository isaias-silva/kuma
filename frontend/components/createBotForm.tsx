import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import profileErro from '../public/corrupted.png'
import loadImage from '../public/load.gif'
import styles from '@/styles/Home.module.css'
import Image from 'next/image';
import infoTelegramUser from '@/services/telegramService';




export default function CreateBotForm() {
    type CreateBotInputs = {
        botName: string;
        apiKey: string;
    };
    const route = useRouter()
    const [botInfo, setBotInfo] = useState<{ profile?: string | null | void, name?: string }|null>()
    useEffect(() => {

    }, [])



    const { register, handleSubmit, formState: { errors } } = useForm<CreateBotInputs>();

    const onSubmit = async (data: CreateBotInputs) => {


    };
    const validateBotName = (value: string) => {
        let error;
        if (!value) {
            error = "name is required"
        }
        if (value && value.length <= 3) {
            error = "name is short! min: 4 digits"
        }
        if (value && value.length >= 20) {
            error = "name is to long! max: 19 digits"
        }
        return error || true;
    };
    const validateApiKey = async (value: string) => {
        let error;
        if (!value) {
            error = "api key is required"
        }
        const info = await infoTelegramUser(value)

        if (!info) {
            error = "invalid api key"

        }

        return error || true;
    }

    const updateInfoBot = async (ev: any) => {
      
        if (!ev.target.value && typeof ev.target.value != 'string') {
            setBotInfo(null)
            return
        }
        setBotInfo({profile:loadImage.src,name:'load'})
        const info = await infoTelegramUser(ev.target.value)
        if (info) {
            setBotInfo(info)
        }else{
            setBotInfo(null)
        }
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.botForm}>
            <h3>create bot</h3>
            <div className={styles.blocks}>
                <div className={styles.block}>
                    <h4>info</h4>
                    <div>

                        <input type="text"
                            {...register("botName", { validate: validateBotName })}
                            placeholder='bot name' />

                        {errors.botName ? <span>{errors.botName.message}</span> : null}


                    </div>
                    <div>

                        <input type="text"
                            {...register("apiKey", { validate: validateApiKey })}
                            placeholder='apiKey'
                            onInput={updateInfoBot}
                        />

                        {errors.apiKey ? <span>{errors.apiKey.message}</span> : null}
                    </div>
                </div>
                <div className={styles.block}>
                    <Image src={botInfo?.profile || profileErro} alt="profile" className={styles.imageBotProfile} height={150} width={150} />
                    <h5>{botInfo?.name || "invalid api key"}</h5>

                </div>

            </div>



            <button type="submit">create</button>
        </form>
    );
};

