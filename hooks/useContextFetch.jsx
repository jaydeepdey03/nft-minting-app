import { useContext } from "react"
import { Context } from "../Context/MarketplaceContext"

const useContextFetch = () => {
    return useContext(Context)
}

export default useContextFetch
