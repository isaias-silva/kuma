import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


import styles from '@/styles/Home.module.css'
import Image from 'next/image';
import load from '../public/load.gif'
import corrupetd from '../public/corrupted.png'



import { updateName, updateUserProfile } from '@/services/updateUserInfo';
import path from 'path';
import Iuser from '@/interfaces/Iuser';
import getUserInfo from '@/services/userInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import DefaultConfigModal from '@/utils/generateConfigModal';


export default function EditProfileForm() {
    type UpdateProfileInputs = {
        name: string;
        profile: FileList;
    };
    const router = useRouter()
    const [profilePreview, setProfilePreview] = useState<string>()
    const [name, setName] = useState<string>()
    const [userInfo, setUserInfo] = useState<Iuser>()

    useEffect(() => {
        getUserInfo().then(res => {
            if (res) {
                const { data } = res.data
                if (data) {

                    setUserInfo(data)
                    setName(data.name)
                }
            }
        })
    }, [])



    const { register, handleSubmit, formState: { errors } } = useForm<UpdateProfileInputs>();

    const onSubmit = async (data: UpdateProfileInputs) => {
        const { name, profile } = data
        if (!name && !profile[0]) {
            return
        }

        DefaultConfigModal({
            text: 'Do you want to save the changes?',
            title: 'save changes?',
            icon: 'question',
            showButtons: true
        }).fire().then(async (result) => {
            if (result.isConfirmed) {
                if (data.name) {
                    const res = await updateName(data.name)
                    if (res.status == 200) {
                        router.reload()
                    } else {
                        DefaultConfigModal({
                            text: res.data.message,
                            title: res.status,
                            icon: 'error'
                        }).fire()

                    }

                }
                if (data.profile[0]) {

                    const res = await updateUserProfile(data.profile[0])
                    if (res.status == 200) {
                        router.reload()
                    } else {

                        alert(res.data.message)
                        console.log(res)
                    }


                }
            }

        })


    };
    const validateName = (value: string) => {
        let error;

        if (value && value.length <= 3) {
            error = "name is short! min: 4 digits"
        }
        if (value && value.length >= 20) {
            error = "name is to long! max: 19 digits"
        }
        return error || true;
    };

    const validateProfile = (value: FileList) => {
        let error;
        const file = value[0]

        if (!file) {
            return
        }

        if (!file.type.includes("image")) {
            error = `${file.type} is not valid file type`

        }


        return error || true;
    };

    const changeImage = (ev: any) => {
        const file = ev.target.files[0]

        if (!file) {
            return
        }
        if (!file.type.includes("image")) {
            setProfilePreview(corrupetd.src)
        } else {

            setProfilePreview(URL.createObjectURL(ev.target.files[0]))
        }


    }
    const changeName = (ev: any) => {
        setName(ev.target.value)
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.editForm}>
            <div>

                <div className={styles.profileEdit}>
                    <label htmlFor="profile">
                        <Image src={profilePreview || userInfo?.profile || load} width={150} height={150} alt="select your profile"></Image>
                    </label>

                    <input id="profile"
                        type='file'

                        {...register("profile", { validate: validateProfile })}
                        onInput={changeImage}

                    />


                </div>
                {errors.profile ? <span>{errors.profile.message}</span> : null}

            </div>
            <div>

                <input type="text" {...register("name", { validate: validateName })}
                    onInput={changeName}
                    value={name} />

                {errors.name ? <span>{errors.name.message}</span> : null}
            </div>



            <button type="submit">update</button>
        </form>
    );
};

