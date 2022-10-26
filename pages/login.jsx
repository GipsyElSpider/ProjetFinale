import { useState } from 'react';
import Head from 'next/head';
import Header from "../components/Header"
import axios from "axios"
import { useRouter } from 'next/router';
import verifyToken from "../middleware/auth"
import { Buffer } from 'buffer';

const Login = (props) => {
    const router = useRouter()
    const [data, setData] = useState({
        "username": '',
        "password": ''
    });
    const [message, setMessage] = useState("");
    async function handleSubmit(event) {
        //api login
        event.preventDefault();
        let config = {
            method: 'POST',
            url: `https://supav--soft-belekoy-940e21.netlify.app/login?username=${data.username}&password=${data.password}`,
            headers: {
            },
        };

        const result = await axios(config)
            .then(function (response) {
                return (response);
            })
            .catch(function (error) {
                console.log(error)
                return (error)
            });
        if (result?.response?.status === 403) {
            setMessage(result?.response?.data.message);
            return;
        } else if (result?.status !== 200) {
            setMessage("error");
            return;
        }
        router.push('/');
        return
    }
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bg-gradient ">
            <Head>
                <title>Connection</title>
                <link rel="icon" href="/favicon.svg" />
            </Head>

            <Header />

            <main className="flex w-full flex-1 flex-col items-center justify-center md:px-20 text-center">
                <form className='flex flex-col w-5/6 md:w-1/3 text-left p-6 rounded-xl border-2 bg-indigo-300' onSubmit={handleSubmit}>
                    <div className='w-full flex flex-col mb-6'>
                        {message ? <p className='font-bold text-red-600'>{message}</p> : null}
                        <label className='text-white' htmlFor='username'>Pseudo:</label>
                        <input value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} type='text' name='username' required />
                    </div>
                    <div className='w-full flex flex-col mb-6'>
                        <label className='text-white' htmlFor='password'>Mot de passe:</label>
                        <input
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            type='password'
                            name='password'
                            required
                        />
                    </div>
                    <div className='w-full flex justify-center'>
                        <button className="btn" type="submit">Valider</button>
                    </div>
                </form>
            </main>

        </div>
    )
}

export default Login

export async function getServerSideProps({ req, res }) {
    const user = verifyToken(req)
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