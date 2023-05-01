import { addBotCommand } from '@/services/createBot'
import styles from '@/styles/Home.module.css'
import DefaultConfigModal from '@/utils/generateConfigModal'
import { useForm } from 'react-hook-form'
type CommandData = {
    command: string,
    description: string
}
export default function CreateCommandForm({ callback, apiKey }: { callback?: Function, apiKey?: string }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CommandData>()

    const validateDescription = (value: string) => {
        let error;
        if (!value) {
            error = 'description is required.'
        }
        if (value.length < 5) {
            error = 'description is to short. please 5 digits or more.'
        }
        if (value.length > 256) {
            error = 'description is to long . please not more of 256 digits.'
        }

        return error
    }
    const validateCommand = (value: string) => {
        let error;
        if (!value) {
            error = 'command is required.'
        }
        if (value.length < 3) {
            error = 'command is to short. please 3 digits or more.'
        }
        if (value.length > 12) {
            error = 'command is to long!'
        }

        return error
    }

    const onSubmit = async (data: CommandData) => {

        if (apiKey) {
            DefaultConfigModal({ text: ' ', title: ' ', icon: 'success' }).showLoading()

            const response = await addBotCommand(apiKey, data.command, data.description)
            if (response.status == 200) {
                DefaultConfigModal({ text: response.data.message, title: 'success', icon: 'success' }).fire()
            } else {
                DefaultConfigModal({ text: response.data.message, title: response.status, icon: 'error' }).fire()

            }
        }
    }
    return <>    <form onSubmit={handleSubmit(onSubmit)} className={styles.commandForm}>
        <button
            onClick={() => {
                if (callback) {
                    callback()
                }
            }}
            className={styles.closbtn}>x</button>
        <h3>Create a new command </h3>
        <div className={styles.blocks}>

            <input type="text" placeholder="command name" {...register('command', { validate: validateCommand })} />
            <textarea placeholder="description" {...register('description', { validate: validateDescription })} />
           
        </div>

        <button>create</button>
        {errors.description ? <span className={styles.error}>{errors.description.message}</span> : null}
        {errors.command ? <span className={styles.error}>{errors.command.message}</span> : null}
    </form>
    </>

}