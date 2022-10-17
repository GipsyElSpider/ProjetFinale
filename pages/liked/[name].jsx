import axios from "axios";
import Head from 'next/head';
import Header from "../../components/Header";
import verifyToken from "../../middleware/auth"
import { useState } from 'react';
import Link from "next/link";

function profile({ liked, user }) {
    const [auth, setAuth] = useState(user);
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bgTest ">
            <Head>
                <title>Mes likes</title>
                <link rel="icon" href="/favicon.svg" />
            </Head>

            <Header auth={auth} />

            <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center py-6">
                <h1 className="font-bold text-2xl">Mes likes</h1>
                <div className='my-6 w-2/3 flex flex-wrap justify-evenly'>
                    {liked.map(photo => (
                        <>
                            <Link href={"/photos/" + photo.id}>
                                <div className='w-5/12 p-4 rounded-xl box-border mb-10 bg-indigo-300 shadow-xl shadow-fuchsia-400'>
                                    <img className="rounded-xl" src={photo.photoLink} alt={photo.titre} />
                                    {photo.username}
                                </div>
                            </Link>
                        </>
                    ))}
                </div>
            </main>
        </div>
    )
}

export async function getServerSideProps({ req, res, params }) {
    const user = verifyToken(req)

    let configLike = {
        method: 'get',
        url: `http://localhost:8888/api/like?username=${params.name}`,
        headers: {}
    };

    const liked = await axios(configLike)
        .then(function (response) {
            return (response.data);
        })
        .catch(function (error) {
            return (error)
        });

    if (user === "A token is required for authentication") {
        res.statusCode = 302;
        res.setHeader("location", "/");
        res.end();
        return {};
    };
    return {
        props: { user: user, liked: liked.data }
    }
};

export default profile