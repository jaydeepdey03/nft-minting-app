import Router from 'next/router'

const Custom404 = () => {
    // const router = useRouter()
    return (
        <>
            <div className='flex justify-between'>
                <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-white cursor-pointer">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                    </svg>
                    <p onClick={() => Router.back()} className="text-white cursor-pointer">Go Back</p>
                </div>
                <div className='transition-all ease-in delay-75 hover:animate-pulse'>
                    <p className="text-xl font-bold text-white">NFT Marketplace</p>
                </div>
            </div>
            <div className="h-screen bg-gradient-to-tl from-purple-500 to-pink-500 p-7 w-[90vw] flex place-content-center items-center flex-col">
                <img src={`/assets/img404.svg`} alt="" className="h-1/2 w-1/2" />
                <p className="font-bold text-2xl text-white">Sorry! We Couldn't find the page you requested for</p>
            </div>
        </>
    )
}

export default Custom404
