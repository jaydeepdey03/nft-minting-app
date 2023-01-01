import '../styles/globals.css'
import localFont from '@next/font/local'
import MarketplaceContextProvider from '../Context/MarketplaceContext'

const Satoshi = localFont({ src: '../fonts/Satoshi-Medium.woff2' })

export default function App({ Component, pageProps }) {
  return (
    <div style={Satoshi.style} className='bg-gradient-to-tl from-purple-500 to-pink-500 p-7'>
      <MarketplaceContextProvider>
        <Component {...pageProps} />
      </MarketplaceContextProvider>
    </div>
  )
}
