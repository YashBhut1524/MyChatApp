import animationData from "@/components/animations/search.json";
import lottie from "lottie-web";
import { useEffect, useRef } from "react";

function SearchAnimation() { // Accept the msg prop
    const errorAnimationContainer = useRef(null);

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: errorAnimationContainer.current,
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div ref={errorAnimationContainer}  />
        </div>
    );
};

export default SearchAnimation;
