import { useState } from 'react';
import Head from 'next/head';
import Header from "../components/Header"
import axios from "axios"
import { useRouter } from 'next/router';
import Cookies from 'cookies'
const Login = (props) => {
    const router = useRouter()
    const [data, setData] = useState({
        "username": '',
        "password": ''
    });
    const [message, setMessage] = useState("");
    async function handleSubmit(event) {
      console.log(data)
        event.preventDefault();
        let config = {
            method: 'POST',
            url: 'http://localhost:8888/api/login',
            headers: {
            },
            data:
            {
                username: data.username,
                password: data.password
            }
        };

        const result = await axios(config)
            .then(function (response) {
                return (response);
            })
            .catch(function (error) {
                console.log(error)
                return (error)
            });
        console.log('test', result);
        if (result?.status === 400 && result?.response?.data?.message === "Username already use") {
            console.log("here")
            setMessage("Pseudo déja utilisé");
        }
        if (result?.status !== 200) return
        router.push('/');
        return
    }
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-blue-200 ">
            <Head>
                <title>Inscription</title>
                <link rel="icon" href="/favicon.svg" />
            </Head>

            <Header />

            <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
                <form className='flex flex-col w-1/3 text-left p-6 border' onSubmit={handleSubmit}>
                    <div className='w-full flex flex-col mb-6'>
                        {message ? message : null}
                        <label htmlFor='username'>Pseudo:</label>
                        <input value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} type='text' name='username' id='username' required />
                    </div>
                    <div className='w-full flex flex-col mb-6'>
                        <label htmlFor='password'>Mot de passe:</label>
                        <input
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            type='password'
                            name='password'
                            id='password'
                            required
                        />
                    </div>
                    <div className='w-full flex justify-center'>
                        <button className='border rounded-xl w-1/2' type='submit'>
                            Valider
                        </button>
                    </div>
                </form>
            </main>

        </div>
    )
}

export default Login

export async function getServerSideProps({ req, res }) {
    const cookies = new Cookies(req, res)
    const user = cookies.get('user')
    if (user) {
      res.statusCode = 302;
      res.setHeader("location", "/");
      res.end();
      return
    } else {
      return {
        props: { user: null }
      }
    }
  };