import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/router';


import styles from '@/styles/Home.module.css'
import Image from 'next/image';
import perfil from '../public/login.png'
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import Cookie from 'js-cookie'
import login from '@/services/login';

export default function LoginForm() {
    type LoginFormInputs = {
        name: string;
        password: string;
    };

    const router = useRouter()

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const onSubmit = async (data: LoginFormInputs) => {
        const response: { status: number, data: { message: string, data: { token: string } } } = await login(data);
        if (response.status == 201) {
            Cookie.set('token', response.data.data.token)
            router.push('/user')
        } else {
            console.log(response)
            alert('erro! ' + response.data.message)
        }
    };
    const validateName = (value: string) => {
        let error;
        if (!value) {
            error = "Name is required";
        }
        else if (value.length < 3) {
            error = "name is short! min: 3 digits"
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

    const [visiblePassword, setVisiblePassword] = useState<Boolean>(false)
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.login}>
            <Image src={perfil} alt={''} width={100} height={100}></Image>
            <div>
                <label htmlFor="email">User name</label>
                <input type="text" {...register("name", { validate: validateName })} />
                {errors.name ? <span>{errors.name.message}</span> : null}
            </div>

            <div>
                <label htmlFor="#password">Password</label>
                <div className={styles.input_view}>
                    <input type={visiblePassword ? 'text' : 'password'} {...register("password", { validate: validatePassword })} />

                    <FontAwesomeIcon className={styles.btn_activate}
                        icon={visiblePassword ? faEyeSlash : faEye}
                        onClick={() => { setVisiblePassword(!visiblePassword) }}
                    />
                </div>
                {errors.password ? <span>{errors.password.message}</span> : null}

            </div>

            <button type="submit">Login</button>
            <Link href={'https://hihihi.com'}>don't have an account? contact the admin!</Link>
        </form>
    );
};

