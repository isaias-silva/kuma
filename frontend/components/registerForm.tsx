import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/router';


import styles from '@/styles/Home.module.css'
import Image from 'next/image';
import perfil from '../public/login.png'
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import Cookies from 'js-cookie'
import login from '@/services/login';

import DefaultConfigModal from '@/utils/generateConfigModal';

export default function RegisterForm() {

    type RegisterForm = {
        name: string;
        email: string;
        password: string;
        passwordRepite: string;
    };

    const router = useRouter()

    const { register, handleSubmit, formState: { errors },getValues } = useForm<RegisterForm>();

    const onSubmit = async (data: RegisterForm) => {
        const response: { status: number, data: { message: string, data: { token: string } } } = await login(data);
        if (response.status == 201) {
            Cookies.set('token', response.data.data.token)



            DefaultConfigModal({
                text: 'user created!',
                icon: 'success',
                title: 'wellcome'
            }).fire()
                .then(() => {
                    router.push('/user')

                })
        } else {
            DefaultConfigModal({
                title: response.status.toString(),
                icon: 'error',
                text: response.data.message
            }).fire()


        }
    };
    const validatename = (value: string) => {
        let error;
        if (!value) {
            error = "name is required";
        }
        else if (value.length < 3) {
            error = "name is short! min: 3 digits"
        }
        return error || true;
    };

    const validateemail = (value: string) => {
        let error;
        if (!value) {
            error = "email is required";
        }
        else if (value.length < 3) {
            error = "email is short! min: 3 digits"
        }
        return error || true;
    };

    const validatePassword = (value: string) => {
        let error;
        if (!value) {
            error = "password is required";
        } else if (value.length < 8) {
            error = "password is short! min: 8 digits";
        }
        return error || true;
    };
    const validatePasswordRepite = (value: string) => { 
        let error;
        if (!value) {
            error = "password repite is required";
        }
        if (value!=getValues("password")){
            error = "password repite and password is not equals.";

        }
        return error || true;
    }

    const [visiblePassword, setVisiblePassword] = useState<Boolean>(false)
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.login}>

            <Image src={perfil} alt={''} width={100} height={100}></Image>
            <div>
                <label htmlFor="email">Name</label>
                <input type="text" {...register("name", { validate: validatename })} />
                {errors.name ? <span>{errors.name.message}</span> : null}
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input type="email" {...register("email", { validate: validateemail })} />
                {errors.email ? <span>{errors.email.message}</span> : null}
            </div>

            <div>
                <label htmlFor="#password">Password</label>
                <div className={styles.input_view}>
                    <input type={visiblePassword ? 'text' : 'password'} {...register("password", { validate: validatePassword })} />

                    <FontAwesomeIcon className={styles.btn_activate} width={24}
                        icon={visiblePassword ? faEyeSlash : faEye}
                        onClick={() => { setVisiblePassword(!visiblePassword) }}
                    />
                </div>
                {errors.password ? <span>{errors.password.message}</span> : null}

            </div>
            <div>
                <label htmlFor="#password-repite">Password repite</label>
               
                    <input type={visiblePassword ? 'text' : 'password'} {...register("passwordRepite", { validate: validatePasswordRepite })} />

             
                {errors.passwordRepite ? <span>{errors.passwordRepite.message}</span> : null}

            </div>

            <button type="submit">Register</button>
            <Link href={'/login'}>you have account?</Link>
        </form>
    );
};

