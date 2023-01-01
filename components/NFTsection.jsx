import { ethers } from "ethers"
import MarketplaceJSON from '../utils/Marketplace.json'
import { useState, useEffect } from "react"
import NFT from "./NFT"
import Link from 'next/link'
import Spinner from "./Spinner"
import useContextFetch from "../hooks/useContextFetch"

const NFTsection = () => {
    const [fetchedItem, setFetchedItem] = useState([])
    const [loading, setLoading] = useState(false)

    const { chainId, account, connectWallet } = useContextFetch()

    const getAllNFT = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        let transaction = await contract.getAllNFTs()

        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId)
            let meta = await (await fetch(tokenURI, { method: 'GET' })).json()

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.image,
                name: meta.name,
                description: meta.description,
            }
            return item;
        }))

        setFetchedItem(items)
    }

    useEffect(() => {
       setLoading(true)
        chainId === '0x13881' && getAllNFT()
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }, [chainId])

    if (account === '') {
        return (
            <div className="flex flex-col place-items-center mt-20 h-[90vh]">
                <button onClick={connectWallet} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Connect to Wallet
                </button>
            </div>
        )
    }

    if(loading === true){
        return (
            <div className="flex flex-col place-items-center h-[90vh]">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="flex flex-col place-items-center mt-20 h-[90vh]">
            <div className="md:text-xl font-bold text-white">
                Listed NFTs
            </div>

            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                {fetchedItem.map((value, index) => {
                    return <NFT data={value} key={index}></NFT>;
                })}
            </div>
        </div>
    )
}

export default NFTsection
