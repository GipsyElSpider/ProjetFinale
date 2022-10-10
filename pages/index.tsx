import type { NextPage } from 'next'
import { useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import Header from "../components/Header"
import Cookies from 'cookies'

const Home: NextPage = (props) => {
  const [auth, setAuth] = useState(props.user);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header auth={auth} />

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">

      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
    </div>
  )
}

export default Home

export async function getServerSideProps({ req, res }) {
  const cookies = new Cookies(req, res)
  const user = cookies.get('user')
  if (user) {
    return {
      props: { user } // will be passed to the page component as props
    }
  } else {
    return {
      props: { user: null } // will be passed to the page component as props
    }
  }
};