import React from 'react'
import { Platform } from 'react-native';

/*  CSS Variables used in index.html to set the scrollbar style
    ===========================================================
    --scrollbar-thickness: 10px;
    --scrollbar-border-radius: 5px;
    --scrollbar-track-color: #222;
    --scrollbar-thumb-color: #aaa;
    --scrollbar-thumb-hover-color: #ddd;
*/

export interface ScrollbarStyle {
    thickness: string;
    borderRadius: string;
    trackColor: string;
    thumbColor: string;
    thumbHoverColor: string;
}

const getVar = (name: string) => window.getComputedStyle(document.documentElement).getPropertyValue(name);
const setVar = (name: string, value: string) => document.documentElement.style.setProperty(name, value);

export const useWebScrollbarStyle = () => {
    // This hook is only for the web platform, return early if not web
    if (Platform.OS !== 'web') {
        return {
            scrollbarStyle: {
                thickness: '0px',
                borderRadius: '0px',
                trackColor: 'transparent',
                thumbColor: 'transparent',
                thumbHoverColor: 'transparent',
            } as ScrollbarStyle,
            setScrollbarStyle: (style: ScrollbarStyle) => {
            }
        }
    };

    // Start of hook for the web platform
    const style = React.useRef<ScrollbarStyle>({
        thickness: getVar('--scrollbar-thickness'),
        borderRadius: getVar('--scrollbar-border-radius'),
        trackColor: getVar('--scrollbar-track-color'),
        thumbColor: getVar('--scrollbar-thumb-color'),
        thumbHoverColor: getVar('--scrollbar-thumb-hover-color'),
    });

    React.useEffect(() => {
        setVar('--scrollbar-thickness', style.current.thickness);
        setVar('--scrollbar-border-radius', style.current.borderRadius);
        setVar('--scrollbar-track-color', style.current.trackColor);
        setVar('--scrollbar-thumb-color', style.current.thumbColor);
        setVar('--scrollbar-thumb-hover-color', style.current.thumbHoverColor);
    }, [style]);

    return { scrollbarStyle: style.current, setScrollbarStyle: (newStyle: ScrollbarStyle, reload: boolean = false) => {
        style.current = newStyle 
        // The above is ideal, but needed a way to update scrollbars on theme changed, so added a reload option
        if (reload)
            window.location.reload();
    }};
}

export default useWebScrollbarStyle