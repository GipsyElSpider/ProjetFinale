import axios from "axios";
import Head from 'next/head';
import Header from "../../components/Header";
import verifyToken from "../../middleware/auth"
import { useState } from 'react';
import PhotosViews from '../../components/photosViews';

function profile({ liked, user, likeUser }) {
    const [auth, setAuth] = useState(user);
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bg-gradient ">
            <Head>
                <title>Likes de {likeUser}</title>
                <link rel="icon" href="/favicon.svg" />
            </Head>

            <Header auth={auth} />

            <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center py-6">
                <h1 className="font-bold text-2xl mb-6 ">Likes de {likeUser}: </h1>
                <PhotosViews data={liked} />
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
        props: { user: user, liked: liked.data, likeUser: params.name }
    }
};

export default profile