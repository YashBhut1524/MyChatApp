// import { animationDefaultOptions } from "@/lib/utils"
import { useEffect, useRef } from "react"
import lottie from 'lottie-web';
import animationData from "@/components/animations/robotAnimation.json";

function EmptyChatContainer() {

    const container = useRef(null)

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: container.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData, // Use the imported animation data
        });

        // Cleanup function
        return () => {
            animation.stop();
            animation.destroy();
        };
    }, []);

    return (
        <div className="flex-1 md:bg-[#15172e] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
            <div ref={container} className="h-[30vh] w-[30vw]" />
            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
                <h3 className="poppins-medium">
                    Hi <span className="text-[#805BE6]">!</span>Welcome To
                    <span className="text-[#805BE6]"> Chat</span>App <span className="text-purple-500">.</span>
                </h3>
            </div>
        </div>
    )
}

export default EmptyChatContainer   
