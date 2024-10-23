import animationData from "@/components/animations/errorAnimation.json";
import lottie from "lottie-web";
import { useEffect, useRef } from "react";

// eslint-disable-next-line react/prop-types
function ErrorAnimation({ msg }) { // Accept the msg prop
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
            <div ref={errorAnimationContainer} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
            <span>{msg}</span> {/* Display the passed msg */}
        </div>
    );
};

export default ErrorAnimation;
