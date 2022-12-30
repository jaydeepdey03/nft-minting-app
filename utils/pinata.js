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
      name: 'File name',
    });
    formData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options);

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT
        }
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
}
