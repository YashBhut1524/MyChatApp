import animationData from "@/components/animations/logo.json"
import lottie from "lottie-web"
import { useEffect, useRef } from "react"

function LogoAnimation() {

    const logoAnimationContainer = useRef(null)

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: logoAnimationContainer.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData
        })
        return () => {
            animation.stop();
            animation.destroy()
        }
    }, [])

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div ref={logoAnimationContainer} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
            <span></span> {/* Display the passed msg */}
        </div>
    )
}

export default LogoAnimation