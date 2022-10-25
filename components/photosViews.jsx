import Link from "next/link";
const PhotosViews = ({ data }) => {
    return (
        <div className='my-6 w-full xl:w-2/3 flex flex-wrap justify-evenly'>
            {data.map(photo => (
                <>
                    <Link href={"/photos/" + photo.id}>
                        <div className='imageCard w-full lg:w-5/12 p-4 rounded-xl box-border mb-10 bg-indigo-300 shadow-xl shadow-fuchsia-400'>
                            <img className="w-full rounded-xl" src={photo.photoLink} alt={photo.titre} />
                            <p className='pt-2'>Photo de {photo.username}</p>
                        </div>
                    </Link>
                </>
            ))}
        </div>
    )
};

export default PhotosViews;