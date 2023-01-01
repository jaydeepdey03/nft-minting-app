import Head from 'next/head'
import Navbar from '../components/Navbar'
import NFTsection from '../components/NFTsection'



export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="nftmarketplace" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <NFTsection />
    </>
  )
}
