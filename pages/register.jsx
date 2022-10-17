import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from "../components/Header";
import axios from "axios"
import { useRouter } from 'next/router';
import verifyToken from "../middleware/auth"
const Register = (props) => {
    const router = useRouter()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    //const [btn, setBtn] = useState(0);
    /* useEffect(() => {
        setBtn(document.querySelector("#btn"));
    }, []); */

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
        let config = {
            method: 'POST',
            url: 'http://localhost:8888/api/register',
            headers: {
            },
            data:
            {
                username,
                password
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
            
        if (result?.response?.status === 403) {
            setMessage("Pseudo déja utilisé");
            return;
        }
        if (result?.status !== 200) return
        router.push('/');
        return
    };

    //let position = 0;

    /* if (btn && (!(password !== "") || username === "")) {
        btn.addEventListener("mouseover", function () {
            position === 300 ? position = 0 : position = 300;
            btn.style.transform = `translate(${position}%, 0px)`;
            btn.style.transition = "all 0.3s ease";
            return
        });
    }; */

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
                        {message ? <p className='font-bold text-red-600'>{message}</p> : null}
                        <label htmlFor='username'>Pseudo:</label>
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
                        <label htmlFor='password'>Mot de passe:</label>
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
                        <button id="btn" type="submit">Valider</button>
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