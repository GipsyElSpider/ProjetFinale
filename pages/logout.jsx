import Head from 'next/head'
import { useRouter } from 'next/router';
import Cookies from 'cookies';
const Logout = () => {
    const router = useRouter();
    router.push('/');
    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Head>
                <title>Déconnection</title>
                <link rel="icon" href="/favicon.svg" />
            </Head>
        </div>
    )
}

export default Logout

export async function getServerSideProps({ req, res }) {
    //delete cookie user
    const cookies = new Cookies(req, res)
    cookies.set('user', '', {
        httpOnly: true
    });
    return {
        props: { data: null }
    }
}