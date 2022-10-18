import Link from 'next/link';
const Header = ({ auth }) => {
    return (
        <div className="w-full flex flex-col md:flex md:flex-row px-12 py-6 bg-discordGray justify-between">
            <Link href={"/"}>
                <img className="h-12 w-12 mx-auto md:mx-0" src="../data/icon-naruto.svg" alt='logo site' />
            </Link>
            {auth ?
                <div className='flex flex-col md:flex-row w-full mx-auto md:mx-0 md:w-1/3 xl:w-1/4 md:justify-end items-center'>
                    <Link href={"/logout"}>
                        <button className='w-fit rounded-xl border px-4 py-2 bg-gray-300 font-bold md:mr-4 mb-2 md:mb-0'>
                            Déconnection
                        </button>
                    </Link>
                    <Link href={`/myprofile`}>
                        <button className='w-fit rounded-xl border px-4 py-2 bg-gray-300 font-bold'>
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