import { React, useEffect, useState } from 'react'

const getWindowState = () => {
    if (window.innerWidth > 1280) return '2xl';
    if (window.innerWidth > 1024) return 'xl';
    if (window.innerWidth > 768) return 'lg';
    return 'sm';
}

const windowSize = () => {

    const [currentWindow, setCurrentWindow] = useState('sm');

    useEffect(() => {
        const handleResize = () => {
            setCurrentWindow(getWindowState())
        }
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return currentWindow;
}

export default windowSize;