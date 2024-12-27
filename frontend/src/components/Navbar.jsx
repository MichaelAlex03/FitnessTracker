import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import windowSize from ".././hooks/windowSize"

const Navbar = () => {

    const windowState = windowSize();
    console.log(windowState)

    return (
        <>
            <div className="absolute z-10 top-3 flex items-center w-full px-3 lg:px-8">
                <h1 className="text-white font-bold text-2xl">FitTrackr</h1>
                <button className="ml-auto">
                    <FontAwesomeIcon 
                        icon={faUser} 
                        color="white" 
                        size={windowState != 'sm' && 'md' ? '2xl' : 'xl'}
                    />
                </button>
            </div>
            <header className="text-white h-16 bg-black"></header>
        </>
    )
}

export default Navbar