import { useState } from 'react';
import Head from 'next/head'
import Header from "../components/Header"
import PhotoUpload from "../components/PhotoUpload"
import axios from 'axios';
import Link from 'next/link';
import verifyToken from "../middleware/auth"
const Home = (props) => {
  const [auth, setAuth] = useState(props.user);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <title>Accueil</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Header auth={auth} />

      <main className="flex w-full p-8 flex-1 flex-col items-center justify-center px-20 text-center bg-bgTest">
        {auth ? <div className='w-1/3 flex flex-col mb-8 items-center'> <Link href={"./liked/" + auth}><button className='w-1/3 mb-6 font-bold rounded-2xl px-6 py-4 bg-pink-200 border-2 border-gray-400 shadow-lg shadow-pink-400'>Mes likes</button></Link><PhotoUpload username={auth} /> </div> : null}
        <h1 className="font-bold text-2xl">Toutes les photos</h1>
        <div className='my-6 w-2/3 flex flex-wrap justify-evenly'>
          {props.result.data.map(photo => (
            <>
              <Link href={"/photos/" + photo._id}>
                <div className='w-5/12 p-4 rounded-xl box-border mb-10 bg-indigo-300 shadow-xl shadow-fuchsia-400'>
                  <img className="rounded-xl" src={photo.photoLink} alt={photo.titre} />
                  <p className='pt-2'>Photo de {photo.username}</p>
                </div>
              </Link>
            </>
          ))}
        </div>
      </main>
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
    
  const user = verifyToken(req);

  if (user !== "A token is required for authentication") {
    return {
      props: { user, result }
    }
  } else {
    return {
      props: { user: null, result }
    }
  }
};