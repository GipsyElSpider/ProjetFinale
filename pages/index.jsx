import { useState } from 'react';
import Head from 'next/head'
import Header from "../components/Header"
import PhotoUpload from "../components/PhotoUpload"
import axios from 'axios';
import Link from 'next/link';
import verifyToken from "../middleware/auth"
import PhotosViews from '../components/PhotosViews'
const Home = (props) => {
  const [auth, setAuth] = useState(props.user);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <title>Accueil</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <Header auth={auth} />

      <main className="flex w-full p-8 flex-1 flex-col items-center justify-center px-20 text-center bg-bg-gradient">
        {auth ? <div className='w-1/3 flex flex-col mb-8 items-center'> <Link href={"./liked/" + auth}><button id="myLikesBtn">Mes likes</button></Link><PhotoUpload username={auth} cookie={props.cookie} /> </div> : null}
        <h1 className="font-bold text-2xl mb-6 ">Toutes les photos:</h1>
        {props?.result?.data ? <PhotosViews data={props.result.data} /> : null}
      </main>
    </div>
  )
}

export default Home

export async function getServerSideProps({ req, res }) {
  //Recuperation toutes les photos
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
  //Recuperation utilisateur déja connecté et retours des props en fonction de si une personnes est connectée ou non
  const user = verifyToken(req);
  if (user !== "A token is required for authentication") {
    return {
      props: { user, result: result ?? null, cookie: req.cookies.user }
    }
  } else {
    return {
      props: { user: null, result: result ?? null }
    }
  }
};