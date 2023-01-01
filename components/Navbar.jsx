import Link from 'next/link'
import useContextFetch from "../hooks/useContextFetch";

const Navbar = () => {

    const { connectWallet, account, switchNetwork, chainId } = useContextFetch()
    console.log(account)
    return (
        <>
            <div className="flex space-x-10 text-white justify-between">
                <Link href="/"><p className="text-xl font-bold">NFT Marketplace</p></Link>
                <ul className="flex space-x-6 items-center font-semibold">
                    <Link href={`/`}><li className="link-underline link-underline-black">Marketplace</li></Link>
                    <Link href={`/sellnft`}><li className="link-underline link-underline-black">List My NFT</li></Link>
                    <Link href={`/profile`}><li className="link-underline link-underline-black">Profile</li></Link>
                    <li>
                        {account === '' ?
                            <button onClick={connectWallet} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Connect to Wallet
                            </button> :
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Connected
                            </button>}

                        {
                            account && (chainId !== '0x13881') && (
                                <>
                                    <button onClick={switchNetwork} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        Switch Networkx
                                    </button>
                                    <p>Incompatible Network</p>
                                </>
                            )
                        }
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Navbar
