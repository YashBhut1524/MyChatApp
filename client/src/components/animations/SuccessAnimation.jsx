/* eslint-disable react/prop-types */
import animationData from "@/components/animations/successAnimation.json";
import lottie from "lottie-web";
import { useEffect, useRef } from "react";

    function SuccessAnimation({msg}) {
        const successAnimationContainer = useRef(null);

        useEffect(() => {
            const animation = lottie.loadAnimation({
                container: successAnimationContainer.current,
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
                <div ref={successAnimationContainer} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                <span>{msg}</span> {/* Display the passed msg */}
            </div>
        );
}

export default SuccessAnimation



