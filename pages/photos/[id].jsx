import axios from "axios";
import Head from 'next/head';
import Header from "../../components/Header";
import Cookies from 'cookies'
import { useState } from 'react';

function profile({ data, user }) {
    console.log(data, user)
    const [auth, setAuth] = useState(user);
    function handleLick() {

    };
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-blue-200 ">
            <Head>
                <title>Inscription</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header auth={auth} />

            <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
                <div className="w-1/2 p-8 bg-gray-800 flex rounded-2xl flex flex-col ">
                    <img src={data.photoLink} alt={data.titre}></img>
                    <div className="mt-4 w-full text-left flex">
                        <button className="">:3</button>
                        <p className="text-white">{data.description}</p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export async function getServerSideProps({ req, res, params }) {
    let config = {
        method: 'get',
        url: `http://localhost:8888/api/photos?id=${params.id}`,
        headers: {}
    };

    const result = await axios(config)
        .then(function (response) {
            return (response.data);
        })
        .catch(function (error) {
            return (error)
        });

    const cookies = new Cookies(req, res);
    const user = cookies.get('user');

    if (!user) {
        return {
            props: { user: null } // will be passed to the page component as props
        }
    };
    if (result.status === 403) {
        res.statusCode = 302;
        res.setHeader("location", "/profile/404");
        res.end();
        return {}
    }
    return {
        props: { data: result.data, user: user }
    }
};

export default profile