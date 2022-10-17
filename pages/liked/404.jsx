import Link from "next/link";

export default function Custom404() {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-black">
            <h1 className="text-white mb-8">404 - Liked Not Found</h1>
            <Link href={'/'}><p className="text-white border-4 border-white px-6 rounded-xl cursor-pointer">Home</p></Link>
        </div>
    );
}
