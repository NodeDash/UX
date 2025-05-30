import * as React from "react"

/**
 * The breakpoint width in pixels that determines if a device is considered mobile.
 * Devices with screen width less than this value are classified as mobile devices.
 */
const MOBILE_BREAKPOINT = 768

/**
 * A hook that detects whether the current device is a mobile device based on screen width.
 * Uses a media query to track changes in viewport size and updates state accordingly.
 * 
 * @returns {boolean} True if the current device is a mobile device (screen width < 768px), false otherwise
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
