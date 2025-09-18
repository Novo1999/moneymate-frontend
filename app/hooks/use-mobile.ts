import * as React from 'react'

const MOBILE_BREAKPOINT = 768
const XL2_BREAKPOINT = 1536 // Tailwind's 2xl breakpoint

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}

export function useIs2xl() {
  const [is2xl, setIs2xl] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${XL2_BREAKPOINT}px)`)
    const onChange = () => {
      setIs2xl(window.innerWidth >= XL2_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIs2xl(window.innerWidth >= XL2_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!is2xl
}
