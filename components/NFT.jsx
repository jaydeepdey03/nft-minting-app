import Link from 'next/link'

const NFT = ({data, loading}) => {

    return (
        <Link href={`/nftPage/${data.tokenId}`}>
            <div className="bg-white border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
                <img src={data.image} alt="" className="w-full rounded-b-none h-72 rounded-lg object-cover" />
                <div className="text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
                    <strong className="text-xl">{data.name}</strong>
                    <p className="display-inline">{data.description}</p>
                </div>
                <div className='flex justify-end w-full'>
                    <p className='font-semibold text-sm mr-10 text-[#8a939b]'>{data.price}</p>
                </div>
            </div>
        </Link>
    )
}

export default NFT
