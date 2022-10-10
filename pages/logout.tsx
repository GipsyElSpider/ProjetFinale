import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router';
import Cookies from 'cookies';
const Logout: NextPage = () => {
    const router = useRouter();
    router.push('/');
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Head>
                <title>Déconnection</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
        </div>
    )
}

export default Logout

export async function getServerSideProps({ req, res }) {
    const cookies = new Cookies(req, res)
    cookies.set('user', '', {
        httpOnly: true
    });
    return {
        props: { data: null }
    }
}