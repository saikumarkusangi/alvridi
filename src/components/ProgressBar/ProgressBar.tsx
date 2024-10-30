"use client"
import { useEffect } from "react";
import NProgress from "nprogress"; // Import nprogress
import "nprogress/nprogress.css"; // Import nprogress styles

const ProgressBar = () => {
    useEffect(() => {
        // Start the progress bar
        NProgress.start();

        // Stop the progress bar after a delay
        const handleRouteChangeStart = () => NProgress.start();
        const handleRouteChangeComplete = () => NProgress.done();
        const handleRouteChangeError = () => NProgress.done();

        // Event listeners for route changes
        window.addEventListener("routeChangeStart", handleRouteChangeStart);
        window.addEventListener("routeChangeComplete", handleRouteChangeComplete);
        window.addEventListener("routeChangeError", handleRouteChangeError);

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener("routeChangeStart", handleRouteChangeStart);
            window.removeEventListener("routeChangeComplete", handleRouteChangeComplete);
            window.removeEventListener("routeChangeError", handleRouteChangeError);
        };
    }, []);

    return null; // This component does not render anything itself
};

export default ProgressBar;
