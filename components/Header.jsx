import Link from 'next/link';
const Header = ({ auth }) => {
    return (
        <navbar /* id="header" */  className="w-full flex flex-col md:flex-row px-12 py-6 bg-discordGray justify-center md:justify-between">
            <Link href={"/"}>
                <img className="h-12 w-12 mx-auto md:mx-0" src="../data/icon-naruto.svg" alt='logo site' />
            </Link>
            {auth ?
                <div className='navbar'>
                    <Link href={"/logout"}>
                        <button className='navbarFirstBtn'>
                            Déconnection
                        </button>
                    </Link>
                    <Link href={`/myprofile`}>
                        <button className='navbarSecondBtn'>
                            {auth}
                        </button>
                    </Link>
                </div>
                :
                <div className='navbar'>
                    <Link href={"/login"}>
                        <button className='navbarFirstBtn'>
                            Connection
                        </button>
                    </Link>
                    <Link href={"/register"}>
                        <button className='navbarSecondBtn'>
                            Inscription
                        </button>
                    </Link>
                </div>
            }
        </navbar>
    )
};

export default Header