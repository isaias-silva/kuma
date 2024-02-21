import LoginForm from '@/components/loginForm'
import RegisterForm from '@/components/registerForm'
import styles from '@/styles/Home.module.css'
import Head from 'next/head'



export default function Register() {
 
  return (
    <>
      <Head>
        <title>login</title>
        <meta name="description" content="login with plataform" />
      </Head>
      
      <div className={styles.loginContent}> 

        <RegisterForm/>
      </div>
      

    </>
  )
}
