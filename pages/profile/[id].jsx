import axios from "axios";
import Head from 'next/head';
import Header from "../../components/Header";
import Cookies from 'cookies'
import { useState } from 'react';
import ImageUpload from '../../components/ImageUpload';

function profile({ data, user }) {
    console.log(data[0].link, user)
    const [auth, setAuth] = useState(user);
    const [imageLink, setImageLink] = useState(data[0]?.link ?? '../data/user-upload.svg')
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-blue-200 ">
            <Head>
                <title>Inscription</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header auth={auth} />

            <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center bg-bgTest">
                <div className="w-2/3 rounded-xl p-6">
                    <div className="flex w-2/5">
                        {data[0].link ?
                            <img className="rounded-xl" src={imageLink} alt='Photo de profil' />
                            :
                            <ImageUpload username={auth} imageLink={imageLink} setImageLink={setImageLink}/>
                        }
                        <div className="px-12 flex flex-col text-left w-full">
                            <h1 className="font-bold mb-4 w-full">
                                {data[0].data}
                            </h1>
                            <p className="">
                                Description:
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export async function getServerSideProps({ req, res, params }) {
    let config = {
        method: 'get',
        url: `http://localhost:8888/api/profile?username=${params.id}`,
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
        props: { data: [result], user: user }
    }
};

export default profile