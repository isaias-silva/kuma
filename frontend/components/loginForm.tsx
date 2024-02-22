import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/router';


import styles from '@/styles/Home.module.css'
import Image from 'next/image';
import perfil from '../public/profile.jpeg'
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import Cookies from 'js-cookie'
import login from '@/services/login';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import DefaultConfigModal from '@/utils/generateConfigModal';

export default function LoginForm() {
    
    type LoginFormInputs = {
        email: string;
        password: string;
    };

    const router = useRouter()

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const onSubmit = async (data: LoginFormInputs) => {
        const response: { status: number, data: { message: string, data: { token: string } } } = await login(data);
        if (response.status == 201) {
            Cookies.set('token', response.data.data.token)



            DefaultConfigModal({
                text: 'login is a success',
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

    const [visiblePassword, setVisiblePassword] = useState<Boolean>(false)
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.login}>
          
            <Image src={perfil} alt={''} width={100} height={100}></Image>
            <div>
             
                <input placeholder='your email' type="email" {...register("email", { validate: validateemail })} />
                {errors.email ? <span>{errors.email.message}</span> : null}
            </div>

            <div>
            
                <div className={styles.input_view}>
                    <input placeholder='your password' type={visiblePassword ? 'text' : 'password'} {...register("password", { validate: validatePassword })} />

                    <FontAwesomeIcon className={styles.btn_activate} width={24}
                        icon={visiblePassword ? faEyeSlash : faEye}
                        onClick={() => { setVisiblePassword(!visiblePassword) }}
                    />
                </div>
                {errors.password ? <span>{errors.password.message}</span> : null}

            </div>

            <button type="submit">Login</button>
            <Link href={'/register'}>Are you new here? click to assign!</Link>
        </form>
    );
};

