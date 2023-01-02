import { useState } from "react"
import { ethers } from "ethers"
import Marketplace from '../utils/Marketplace.json'
import { pinFileToIPFS, pinJSONtoIPFS } from "../utils/pinata"
import Spinner from "../components/Spinner"
import Navbar from "../components/Navbar"

const SellNFT = () => {
    const [fileUrl, setFileUrl] = useState(null)
    const [formData, setFormData] = useState({ name: '', description: '', price: '' })
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleOnchange = (e) => {
        setFormData(prevData => {
            return { ...prevData, [e.target.name]: e.target.value }
        })
    }

    const OnFileChange = async (e) => {
        let file = e.target.files[0]
        try {
            const res = await pinFileToIPFS(file)
            // console.log('file uploaded to ' + res.pinataURL)
            setFileUrl(res.pinataURL)
        }
        catch (err) {
            console.log('Upload error', err)
        }
    }

    const uploadMetaDataToIPFS = async () => {
        const { name, description, price } = formData
        if (!name || !description || !price || !fileUrl) return
        const nftJson = { name, description, price, image: fileUrl }

        try {
            const res = await pinJSONtoIPFS(nftJson)
            // console.log("Uploaded JSON to Pinata: ", res)
            return res.pinataURL;
        } catch (err) {
            console.log(err)
        }
    }

    const listNft = async (e) => {
        e.preventDefault()
        try {
            const metadataUrl = await uploadMetaDataToIPFS()
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            setMessage('Uploading..')

            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)
            let listingPrice = await contract.getListPrice()
            listingPrice = listingPrice.toString()
            const price = ethers.utils.parseUnits(formData.price, 'ether')

            // create NFT
            setLoading(true)
            let transaction = await contract.createToken(metadataUrl, price, { value: listingPrice })
            await transaction.wait()
            setLoading(false)
            
            setMessage('')
            setFormData({ name: '', description: '', price: '' })
        }
        catch (err) {
            // console.log(err)
        }
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-col place-items-center h-full w-fulls mt-16" id="nftForm">
                <form className="bg-white shadow-md rounded px-8 pt-4 pb-8">
                    <h3 className="text-center font-bold text-purple-500 mb-8">Upload your NFT to the marketplace</h3>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">NFT Name</label>
                        <input name="name" value={formData.name} onChange={handleOnchange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Axie#4563"></input>
                    </div>
                    <div className="mb-6">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="description">NFT Description</label>
                        <textarea name="description" value={formData.description} onChange={handleOnchange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" cols="40" rows="5" id="description" type="text" placeholder="Axie Infinity Collection"></textarea>
                    </div>
                    <div className="mb-6">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">Price (in ETH)</label>
                        <input name="price" value={formData.price} onChange={handleOnchange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 0.01 ETH" step="0.01"></input>
                    </div>
                    <div>
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="image">Upload Image</label>
                        <input type="file" onChange={OnFileChange}></input>
                    </div>
                    <br></br>
                    {/* <div className="text-green text-center">{message}</div> */}
                    {loading ? <Spinner /> : <div style={{ display: 'none' }}></div>}
                    <button onClick={listNft} className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg">
                        List NFT
                    </button>
                </form>
            </div>
        </>
    )
}

export default SellNFT
