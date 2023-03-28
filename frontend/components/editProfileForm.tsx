import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


import styles from '@/styles/Home.module.css'
import Image from 'next/image';
import load from '../public/load.gif'
import Link from 'next/link';



import { updateName, updateUserProfile } from '@/services/updateUserInfo';
import path from 'path';
import Iuser from '@/interfaces/Iuser';
import getUserInfo from '@/services/userInfo';


export default function EditProfileForm() {
    type LoginFormInputs = {
        name: string;
        profile: FileList;
    };
    const route = useRouter()
    const [profilePreview, setProfilePreview] = useState<string>()
    const [name, setName] = useState<string>()
    const [userInfo, setUserInfo] = useState<Iuser>()
    useEffect(() => {
        getUserInfo().then(data => {
            setUserInfo(data)
            setName(data.name)
        })
    }, [])



    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const onSubmit = async (data: LoginFormInputs) => {
        console.log(data)
        if (data.name) {
            const res = await updateName(data.name)
            if (res.status == 200) {
                route.reload()
            } else {
                alert(res.data.message)
                console.log(res)
            }

        }
        if (data.profile[0]) {

            const res = await updateUserProfile(data.profile[0])
            if (res.status == 200) {
                route.reload()
            } else {

                alert(res.data.message)
                console.log(res)
            }


        }
    };
    const validateName = (value: string) => {
        let error;

        if (value && value.length < 3) {
            error = "name is short! min: 3 digits"
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
            error = `${file.type} is not valid`
        }


        return error || true;
    };

    const changeImage = (ev: any) => {


        setProfilePreview(URL.createObjectURL(ev.target.files[0]))


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
                <label htmlFor="newName">set user name</label>
                <input type="text" {...register("name", { validate: validateName })}
                    onInput={changeName}
                    value={name} />

                {errors.name ? <span>{errors.name.message}</span> : null}
            </div>

            <div>
                <label htmlFor="newName">set telegram api</label>
                <input type="text"
                  />

                {errors.name ? <span>{errors.name.message}</span> : null}
            </div>


            <button type="submit">update</button>
        </form>
    );
};
