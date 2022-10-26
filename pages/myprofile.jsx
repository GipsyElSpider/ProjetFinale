import axios from "axios";
import Head from 'next/head';
import Header from "../components/Header";
import verifyToken from "../middleware/auth"
import { useState } from 'react';
import PhotosViews from "../components/photoviews";

function profile({ data, user }) {
    const [auth, setAuth] = useState(user);
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-blue-200 ">
            <Head>
                <title>Profile de {auth}</title>
                <link rel="icon" href="/favicon.svg" />
            </Head>

            <Header auth={auth} />

            <main className="flex w-full p-8 flex-1 flex-col items-center justify-center px-20 text-center bg-bg-gradient">
                <h1 className="font-bold mb-6 w-full">
                    Toutes mes photos:
                </h1>
                {data ? <PhotosViews data={data.data} /> : null}
            </main>
        </div>
    )
}

export async function getServerSideProps({ req, res }) {
    const user = verifyToken(req)

    if (user === "A token is required for authentication") {

        res.statusCode = 302;
        res.setHeader("location", "/");
        res.end();
        return
    };

    let config = {
        method: 'get',
        url: `https://supav--soft-belekoy-940e21.netlify.app/photos?username=${user}`,
        headers: {}
    };

    const result = await axios(config)
        .then(function (response) {
            return (response.data);
        })
        .catch(function (error) {
            return (error)
        });

    if(!result.data){
        return {
            props: { data: null, user: user }
        }
    }
    return {
        props: { data: result, user: user }
    }
};

export default profile