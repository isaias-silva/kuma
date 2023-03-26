import LoginForm from '@/components/loginForm'
import Head from 'next/head'


export default function Login() {
  return (
    <>
    <Head>
      <title>login</title>
      <meta name="description" content="login with plataform" />
    </Head>
      <LoginForm/>
    </>
  )
}
