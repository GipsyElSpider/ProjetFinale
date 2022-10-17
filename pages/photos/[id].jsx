import axios from "axios";
import Head from 'next/head';
import Header from "../../components/Header";
import Cookies from 'cookies'
import { useState } from 'react';

function PhotosPages({ data, user, liked }) {
    const [auth, setAuth] = useState(user);
    const [like, setLike] = useState(liked ? liked.message : null);
    async function handleLike(e) {
        setLike(like * -1);
        if (like === -1) {
            let config = {
                method: 'delete',
                url: `http://localhost:8888/api/like`,
                headers: {},
                data: {
                    username: user,
                    photoID: data._id
                }
            };
            await axios(config)
                .then(function (response) {
                    return (response.data);
                })
                .catch(function (error) {
                    return (error)
                });
            return
        } else {
            let config = {
                method: 'post',
                url: `http://localhost:8888/api/like`,
                headers: {},
                data: {
                    username: user,
                    photoID: data._id
                }
            };

            await axios(config)
                .then(function (response) {
                    return (response.data);
                })
                .catch(function (error) {
                    return (error)
                });
            return
        };


    };
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bgTest ">
            <Head>
                <title>Photo</title>
                <link rel="icon" href="/favicon.svg" />
            </Head>

            <Header auth={auth} />

            <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
                <div className="w-2/5 p-8 bg-indigo-300 flex rounded-2xl flex flex-col ">
                    <img src={data.photoLink} alt={data.title}></img>
                    <div className="mt-4 w-full text-left flex flex-wrap items-center">
                        {user ? <button onClick={handleLike} className="w-1/12">
                            <svg className={like === 1 ? "fill-white" : "fill-red-600"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path
                                    d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"
                                />
                            </svg>
                        </button> : null}
                        <p className="text-center font-bold text-lg w-11/12">{data.title}</p>
                        <p className="text-lg font-gray-800">
                            <span className="font-semibold text-xl">
                                {data.username}:{" "}
                            </span>
                            {data.description}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export async function getServerSideProps({ req, res, params }) {
    const cookies = new Cookies(req, res);
    const user = cookies.get('user');

    let config = {
        method: 'get',
        url: `http://localhost:8888/api/photos?id=${params.id}`,
        headers: {}
    };

    const result = await axios(config)
        .then(function (response) {
            return (response);
        })
        .catch(function (error) {
            return (error)
        });
        
    if (result?.status !== 200) {
        res.statusCode = 302;
        res.setHeader("location", "/photos/404");
        res.end();
        return {}
    };

    if (!user) {
        return {
            props: { data: result.data.data, user: null, liked: { message: null } }
        }
    };

    let configLike = {
        method: 'get',
        url: `http://localhost:8888/api/like?id=${params.id}&username=${user}`,
        headers: {}
    };

    const liked = await axios(configLike)
        .then(function (response) {
            return (response.data);
        })
        .catch(function (error) {
            return (error)
        });

    return {
        props: { data: result.data.data, user, liked }
    };
};

export default PhotosPages