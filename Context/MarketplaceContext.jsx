import { useState, createContext, useEffect } from "react";
import { useRouter } from 'next/router'
import { ethers } from "ethers";
import Swal from "sweetalert2";
import 'sweetalert2/src/sweetalert2.scss'

export const Context = createContext()

let ethereum
if (typeof window !== 'undefined') {
    ethereum = window.ethereum
}


const MarketplaceContextProvider = ({ children }) => {

    const Router = useRouter()
    const [account, setAccount] = useState('')
    const [address, setAddress] = useState("Ox");
    const [chainId, setChainId] = useState('')

    const getAddress = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const addr = await signer.getAddress()
        setAddress(addr)
    }

    useEffect(() => {
        const checkIfWalletIsConnected = async () => {
            try {

                if (typeof window.ethereum === "undefined") {
                    Swal.fire({
                        title: 'Success',
                        text: 'No Ethereum Object Found',
                        icon: 'error',
                        confirmButtonText: 'Cool'
                    })
                }

                const accounts = await ethereum.request({ method: "eth_accounts" });
                if (accounts.length !== 0) {
                    setAccount(accounts[0])
                }
                else {
                    setAccount('')
                }
                const chainId = await ethereum.request({ method: 'eth_chainId' });
                setChainId(chainId)

                ethereum.on('chainChanged', () => {
                    Router.reload()
                })

            } catch (err) {
                console.log(err)
            }
        }

        checkIfWalletIsConnected()
    }, [ethereum])

    useEffect(() => {

        if (ethereum) {
            ethereum.on("accountsChanged", (accounts) => {

                setAccount(accounts[0]);
                Router.reload()
            })

        } else console.log("No metamask!");

    }, [ethereum])



    const switchNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13881' }],
            });
        } catch (error) {
            console.log(error);
        }
    }



    const connectWallet = async () => {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
            setAccount(accounts[0])
        } catch (error) {
            console.log(ethereum)
            console.log(error)
        }
    }

    return (
        <>
            <Context.Provider value={{ connectWallet, account, switchNetwork, address, getAddress, chainId }}>
                {children}
            </Context.Provider>
        </>
    )
}


export default MarketplaceContextProvider

