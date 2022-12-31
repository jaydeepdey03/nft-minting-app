const Custom404 = () => {
    return (
        <div className="h-screen bg-gradient-to-tl from-purple-500 to-pink-500 p-7 w-screen flex place-content-center items-center flex-col">
            <img src={`/assets/img404.svg`} alt="" className="h-1/2 w-1/2"/>
            <p className="font-bold text-2xl text-white">Sorry! We Couldn't find the page you requested for</p>
        </div>
    )
}

export default Custom404
