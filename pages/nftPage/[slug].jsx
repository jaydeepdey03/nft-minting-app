import { ethers } from "ethers"
import MarketplaceJSON from '../../utils/Marketplace.json'
import { useState, useEffect } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import 'sweetalert2/src/sweetalert2.scss'
import Navbar from "../../components/Navbar"
import { useRouter } from 'next/router'

const NFTPage = () => {
    const [fetchedItem, setFetchedItem] = useState({})
    const [address, setAddress] = useState("Ox");
    const router = useRouter()
    const { slug } = router.query
    console.log(slug)


    const getNFTData = async (tokenId) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        const tokenURI = await contract.tokenURI(tokenId);
        const listedToken = await contract.getListedforTokenId(tokenId);
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        console.log(listedToken);
        let item = {
            price: meta.price,
            tokenId: tokenId,
            seller: listedToken.seller,
            owner: listedToken.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        setFetchedItem(item)
        console.log(item)
    }

    const buyNFT = async (tokenId) => {
        try {

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            //Pull the deployed contract instance
            let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
            const salePrice = ethers.utils.parseUnits(fetchedItem.price, 'ether')

            let transaction = await contract.executeSale(tokenId, { value: salePrice });
            await transaction.wait()

            Swal.fire({
                title: 'Success',
                text: 'NFT has been bought by you',
                icon: 'success',
                confirmButtonText: 'Cool'
            })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getNFTData(slug)
    }, [])

    return (
        <div style={{ "min-height": "100vh" }}>
            <Navbar />
            <div className="flex ml-20 mt-20">
                <img src={fetchedItem.image} alt="" className="w-2/5" />
                <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
                    <div>
                        Name: {fetchedItem.name}
                    </div>
                    <div>
                        Description: {fetchedItem.description}
                    </div>
                    <div>
                        Price: <span className="">{fetchedItem.price + " ETH"}</span>
                    </div>
                    <div>
                        Owner: <span className="text-sm">{fetchedItem.owner}</span>
                    </div>
                    <div>
                        Seller: <span className="text-sm">{fetchedItem.seller}</span>
                    </div>
                    <div>
                        {!address == fetchedItem.owner || !address == fetchedItem.seller?
                            <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Buy thNFTis </button>
                            : <div className="text-emerald-700">You are the owner of this NFT</div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NFTPage
