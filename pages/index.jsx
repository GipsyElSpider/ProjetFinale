import { useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import Header from "../components/Header"
import Cookies from 'cookies'
import PhotoUpload from "../components/PhotoUpload"
import axios from 'axios';
import Link from 'next/link';
const Home = (props) => {
  console.log(props.result.data)
  const [auth, setAuth] = useState(props.user);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <title>Accueil</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header auth={auth} />

      <main className="flex w-full p-8 flex-1 flex-col items-center justify-center px-20 text-center bg-bgTest">
        {auth ? <PhotoUpload username={auth} /> : null}
        <div className='w-2/3 flex flex-wrap justify-evenly'>
          {props.result.data.map(photo => (
            <>
              <Link href={"/photos/"+photo._id}>
                <div className='w-5/12 p-4 rounded-xl box-border mb-10 bg-indigo-300 shadow-xl shadow-fuchsia-400'>
                  <img className="rounded-xl" src={photo.photoLink} alt={photo.titre} />
                  {photo.username}
                </div>
              </Link>
            </>
          ))}
        </div>
      </main>

      {/* <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer> */}
    </div>
  )
}

export default Home

export async function getServerSideProps({ req, res }) {

  let config = {
    method: 'get',
    url: `http://localhost:8888/api/photos`,
    headers: {}
  };

  const result = await axios(config)
    .then(function (response) {
      return (response.data);
    })
    .catch(function (error) {
      return (error)
    });


  const cookies = new Cookies(req, res)
  const user = cookies.get('user')
  if (user) {
    return {
      props: { user, result } // will be passed to the page component as props
    }
  } else {
    return {
      props: { user: null, result } // will be passed to the page component as props
    }
  }
};