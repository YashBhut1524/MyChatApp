import animationData from "@/components/animations/SearchCat.json";
import lottie from "lottie-web";
import { useEffect, useRef } from "react";

function SearchCat() { // Accept the msg prop
    const container = useRef(null);

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
        <div style={{ width: '250px', height: '250px',display: 'flex', alignItems: 'center' }}>
            <div ref={container}  />
        </div>
    );
};

export default SearchCat;
