import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from 'next/link'
import { useRouter } from 'next/router'

const Navbar = () => {
    const Router = useRouter()
    const [address, setAddress] = useState("Ox");
    const [account, setAccount] = useState('')
    const [isConnected, setIsConnected] = useState('not-connected')

    const getAddress = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const addr = await signer.getAddress()
    }

    useEffect(() => {
        let val = window.ethereum.isConnected();
        if (val) {
            getAddress();
            setIsConnected('connected')
            window.localStorage.setItem('is-connected', isConnected)
        }


        window.ethereum.on('accountsChanged', function (accounts) {
            window.location.replace(Router.pathname)
        })
    }, [])


    const connectWallet = async () => {
        try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== '0x13881') {
                //alert('Incorrect network! Switch your metamask network to Rinkeby');
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x13881' }],
                })
            }
            const account = await ethereum.request({ method: 'eth_requestAccounts' })
            setAccount(account[0])
            setIsConnected('connected')
            window.localStorage.setItem('is-connected', 'connected')
        } catch (error) {
            console.log(error)
            window.localStorage.setItem('is-connected', 'not-connected')
        }
    }

    return (
        <>
            <div className="flex space-x-10 text-white justify-between">
                <Link href="/"><p className="text-xl font-bold">NFT Marketplace</p></Link>
                <ul className="flex space-x-6 items-center font-semibold">
                    <Link href={`/`}><li className="link-underline link-underline-black">Marketplace</li></Link>
                    <Link href={`/sellnft`}><li className="link-underline link-underline-black">List My NFT</li></Link>
                    <Link href={`/profile`}><li className="link-underline link-underline-black">Profile</li></Link>
                    <li>
                        {!isConnected ?
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
