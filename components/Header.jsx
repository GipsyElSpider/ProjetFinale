import Link from 'next/link';
const Header = ({ auth }) => {
    return (
        <div className="w-full flex p-6 bg-blue-600 justify-between">
            <Link href={"/"}>
                <p className='w-1/3'>Home</p>
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