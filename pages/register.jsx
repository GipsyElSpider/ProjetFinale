import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from "../components/Header";
import axios from "axios"
import { useRouter } from 'next/router';
import verifyToken from "../middleware/auth";

const Register = (props) => {
    const router = useRouter()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    function handleChangeUsername(event) {
        setUsername(event.target.value)
        return null;
    };
    function handleChangePassword(event) {
        setPassword(event.target.value)
        return null;
    };
    async function handleSubmit(event) {
        event.preventDefault();
        const re = new RegExp("^[a-zA-Z0-9]*$","g")
        const verif = re.exec(username);
        if(!verif){
            setMessage("Le pseudo ne peux contenir que des chiffres et des lettres");
            return
        }
        let config = {
            method: 'POST',
            url: `http://localhost:8888/api/register?username=${username}&password=${password}`,
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
            
        if (result?.response?.status === 409) {
            setMessage("Pseudo déja utilisé");
            return;
        }
        if (result?.status !== 200){
            setMessage("error");
            return;
        };
        router.push('/');
        return
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bg-gradient">
            <Head>
                <title>Inscription</title>
                <link rel="icon" href="/favicon.svg" />
            </Head>

            <Header />

            <main className="flex w-full flex-1 flex-col items-center justify-center md:px-20 text-center">
                <form className='flex flex-col w-5/6 lg:w-1/3 text-left p-6 rounded-xl border-2 bg-indigo-300' onSubmit={handleSubmit}>
                    <div className='w-full flex flex-col mb-6'>
                        {message ? <p className='font-bold text-red-600'>{message}</p> : null}
                        <label className='text-white' htmlFor='username'>Pseudo:</label>
                        <input
                            value={username}
                            onInput={handleChangeUsername}
                            type='text'
                            name='username'
                            minLength={4}
                            required
                        />
                    </div>
                    <div className='w-full flex flex-col mb-6'>
                        <label className='text-white' htmlFor='password'>Mot de passe:</label>
                        <input
                            value={password}
                            onInput={handleChangePassword}
                            type='password'
                            name='password'
                            minLength={4}
                            required
                        />
                    </div>
                    <div className='w-full flex overflow-hidden'>
                        <button className="btn" type="submit">Valider</button>
                        {/* (btn && (password === "") || username === "") ? <><div id="btn" type="submit">Valider</div></> : <><button id="btnStatic" type="submit">Valider</button></> */}
                        {/* <button id="btn" type="submit">Valider</button> */}
                    </div>
                </form>
            </main>

        </div>
    )
}

export default Register

export async function getServerSideProps({ req, res }) {
    const user = verifyToken(req)
    if (user !== "A token is required for authentication") {
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