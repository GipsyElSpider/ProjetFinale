import axios from 'axios'
import Router from 'next/router';
import { useState } from 'react';
const PhotoUpload = ({ username }) => {
    const [step, setStep] = useState(0);
    const [preview, setPreview] = useState("./data/plus-square-solid.svg")
    const [publication, setPublication] = useState({
        photo: null,
        titre: "",
        description: ""
    });

    function handleClick() {
        setStep(1)
    }
    function handleClickCancel() {
        setStep(0)
    }
    function handleImage(e) {
        URL.revokeObjectURL(objectUrl)
        setPublication({ ...publication, photo: e.target.files[0] })
        const objectUrl = URL.createObjectURL(e.target.files[0]);
        setPreview(objectUrl);
    };

    async function handleSubmit() {
        let formData = new FormData();
        formData.append('profileImage', publication.photo);
        formData.append('titre', publication.titre);
        formData.append('description', publication.description);
        formData.append('username', username);

        let config = {
            method: 'post',
            url: `http://localhost:8888/api/photoUpload`,
            headers: {
            },
            data: formData
        };

        const result = await axios(config)
            .then(function (response) {
                return (response.data);
            })
            .catch(function (error) {
                return (error)
            });

        Router.push(`/photos/${result.data}`)
    };

    if (step === 0) {
        return (
            <div>
                <button onClick={handleClick} className='font-bold rounded-2xl px-6 py-4 bg-pink-200 border-2 border-gray-400 h-max flex items-center shadow-lg shadow-pink-400'> Upload Photo <img className='ml-2 h-4 w-4 box-border' src={"../data/plus-solid.svg"} /></button>
            </div>
        )
    } else if (step === 1) {
        return (
            <div className='w-full top-0 left-0 h-screen fixed flex items-center justify-center bg-blackOpa '>
                <div className='opacity-100 bg-gray-800 px-2 sm:px-10 py-2 w-3/5 lg:w-2/5 rounded-2xl flex flex-col'>
                    <div className='flex justify-between items-center mb-6'>
                        <p className='text-white px-4'>Publier une Photo</p>
                        <button onClick={handleClickCancel} className='p-2 font-bold text-white'>X</button>
                    </div>
                    <div className='w-full flex flex-wrap mb-6'>
                        <label htmlFor='uploadPhoto' className='text-white sm:px-4 cursor-pointer mb-4 mx-auto w-1/2 '>
                            <img className='mx-auto h-fit w-fit rounded-xl' src={preview} alt='Upload Photo' />
                        </label>
                        <input className='hidden w-0' onChange={handleImage} type={"file"} id='uploadPhoto'></input>
                        <textarea value={publication.description} onChange={e => setPublication({ ...publication, description: e.target.value })} className='mx-auto w-4/5 rounded-2xl p-2 resize-none' placeholder='Legende de la photo'></textarea>
                    </div>
                    <div className='flex mb-6 flex items-center flex flex-col'>
                        <label htmlFor='title' className='font-semibold px-4 text-white w-1/5'>Titre: </label>
                        <input value={publication.titre} onChange={e => setPublication({ ...publication, titre: e.target.value })} className='rounded-xl w-4/5 p-2' type={"text"} id='title'></input>
                    </div>
                    <button onClick={handleSubmit} className='box-border mb-2 mx-auto py-2 px-4 rounded-xl w-fit border-2 text-white'>Valider</button>
                </div>
            </div>
        )
    }
};

export default PhotoUpload