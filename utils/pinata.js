const pinataApiKey = process.env.NEXT_PUBLIC_Pinata_API_Key
const apiSecret = process.env.NEXT_PUBLIC_Pinata_API_Secret
const pinataJwt = process.env.NEXT_PUBLIC_Pinata_JWT

const axios = require('axios')
const FormData = require('form-data')

export const pinFileToIPFS = async () => {
    const formData = new FormData();
    const src = "../Files/pic1.jpg";

    const file = fs.createReadStream(src)
    formData.append('file', file)

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    })
    formData.append('pinataOptions', options);

    return axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: pinataApiKey,
            pinata_secret: apiSecret,
        }
    }).then(res=>{
        console.log('Image Uploaded', res.data.IpfsHash)
        return {
            success: true,
            pinataUrl: 'https://gateway.pinata.cloud/ipfs/' + res.data.IpfsHash
        }
    }).catch(err=>{
        console.log(err)
        return {
            error: err.message,
            success: false
        }
    })
}


export const pinJSONtoIPFS = async () => {

    const data = JSON.stringify({
        "pinataOptions": {
            "cidVersion": 1
        },
        "pinataMetadata": {
            "name": "testing",
            "keyvalues": {
                "customKey": "customValue",
                "customKey2": "customValue2"
            }
        },
        "pinataContent": {
            "somekey": "somevalue"
        }
    });

    const config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${pinataJwt}`,
        },
        data: data
    };

    const res = await axios(config);

    console.log(res.data);
}