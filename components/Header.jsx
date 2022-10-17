import Link from 'next/link';
const Header = ({ auth }) => {
    return (
        <div className="w-full flex px-12 py-6 bg-discordGray justify-between">
            <Link href={"/"}>
                <img className="h-12 w-12" src="../data/icon-naruto.svg" alt='logo site' />
            </Link>
            {auth ?
                <div className='flex w-1/4 justify-evenly'>
                    <Link href={"/logout"}>
                        <button className='rounded-xl border px-4 py-2 bg-gray-300 font-bold'>
                            Déconnection
                        </button>
                    </Link>
                    <Link href={`/profile/${auth}`}>
                        <button className='rounded-xl border px-4 py-2 bg-gray-300 font-bold'>
                            {auth}
                        </button>
                    </Link>
                </div>
                :
                <div className='flex w-1/4 justify-evenly'>
                    <Link href={"/login"}>
                        <button className='rounded-xl border px-4 py-2 bg-gray-300 font-bold'>
                            Connection
                        </button>
                    </Link>
                    <Link href={"/register"}>
                        <button className='rounded-xl border px-4 py-2 bg-gray-300 font-bold'>
                            Inscription
                        </button>
                    </Link>
                </div>
            }
        </div>
    )
};

export default Header