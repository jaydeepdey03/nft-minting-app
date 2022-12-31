const pinataApiKey = process.env.NEXT_PUBLIC_Pinata_API_Key
const apiSecret = process.env.NEXT_PUBLIC_Pinata_API_Secret
const pinataJwt = process.env.NEXT_PUBLIC_Pinata_JWT

const axios = require('axios')
const FormData = require('form-data')

export const pinFileToIPFS = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: file.name,
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    data.append('pinataMetadata', metadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);

    return axios
        .post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                Authorization: `Bearer ${pinataJwt}`
            }
        })
        .then(function (response) {
            console.log("image uploaded", response.data.IpfsHash)
            return {
                success: true,
                pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
            };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

        });
}


export const pinJSONtoIPFS = async (json) => {

    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    return axios
        .post(url, json, {
            headers: {
                "Content-Type": `application/json`,
                Authorization: `Bearer ${pinataJwt}`
            }
        })
        .then(function (response) {
            return {
                success: true,
                pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
            };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

        });
}