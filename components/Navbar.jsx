import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from 'next/link'

const Navbar = () => {
    const [connected, setConnected] = useState(false)
    const [address, setAddress] = useState("Ox");
    const [account, setAccount] = useState('')
    const [isConnected, setIsConnected] = useState('not-connected')

    const getAddress = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const addr = await signer.getAddress()
    }

    useEffect(() => {
        if (typeof window != 'undefined') {
            setIsConnected(window.localStorage.getItem('is-connected'))
        }
    }, [isConnected])

    const connectWallet = async () => {
        try {
            const account = await ethereum.request({ method: 'eth_requestAccounts' })
            setAccount(account[0])
            setIsConnected('connected')
            window.localStorage.setItem('is-connected', 'connected')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="flex space-x-10 text-white justify-between">
                <p className="text-xl font-bold">NFT Marketplace</p>
                <ul className="flex space-x-6 items-center font-semibold">
                    <Link href={`/`}><li className="link-underline link-underline-black">Marketplace</li></Link>
                    <Link href={`/sellnft`}><li className="link-underline link-underline-black">List My NFT</li></Link>
                    <Link href={`/profile`}><li className="link-underline link-underline-black">Profile</li></Link>
                    <li>
                        {isConnected === 'not-connected' ?
                            <button onClick={connectWallet} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Connect to Wallet
                            </button> :
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Connected
                            </button>}
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Navbar
