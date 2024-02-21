import LoginForm from '@/components/loginForm'
import styles from '@/styles/Home.module.css'
import Head from 'next/head'



export default function Login() {

  return (
    <>
      <Head>
        <title>login</title>
        <meta name="description" content="login with plataform" />
      </Head>
      <div className={styles.loginContent}>
        <LoginForm />

      </div>




    </>
  )
}
