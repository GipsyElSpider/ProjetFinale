import axios from 'axios'

const ImageUpload = ({ imageLink, username, setImageLink }) => {
    async function handleUpload(event) {
        let formData = new FormData();
        formData.append('profileImage', event.target.files[0]);
        formData.append('username', username);
        console.log(username)
        console.log(event.target.files[0])

        let config = {
            method: 'post',
            url: `http://localhost:8888/api/image`,
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

        setImageLink(result.link)
        return;
    };
    return (
        <div className='w-full'>
            <label className='' htmlFor="pp"><img className='rounded-xl w-full' src={imageLink} alt='Input upload image' /></label>
            <input className='hidden' onChange={handleUpload} type={'file'} id='pp' />
        </div>
    )
};

export default ImageUpload