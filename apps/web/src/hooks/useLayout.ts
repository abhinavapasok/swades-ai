import { useState, useEffect, useCallback } from 'react'

export interface LayoutState {
    isMobile: boolean
    sidebarOpen: boolean
    mobileSidebarOpen: boolean
}

export function useLayout() {
    const [isMobile, setIsMobile] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)
            if (mobile) {
                setSidebarOpen(false)
            } else {
                setMobileSidebarOpen(false)
            }
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const toggleSidebar = useCallback(() => {
        if (isMobile) {
            setMobileSidebarOpen(prev => !prev)
        } else {
            setSidebarOpen(prev => !prev)
        }
    }, [isMobile])

    const setSidebar = useCallback((open: boolean) => {
        if (isMobile) {
            setMobileSidebarOpen(open)
        } else {
            setSidebarOpen(open)
        }
    }, [isMobile])

    const closeMobileSidebar = useCallback(() => {
        if (isMobile) {
            setMobileSidebarOpen(false)
        }
    }, [isMobile])

    const openMobileSidebar = useCallback(() => {
        if (isMobile) {
            setMobileSidebarOpen(true)
        }
    }, [isMobile])

    return {
        isMobile,
        sidebarOpen,
        mobileSidebarOpen,
        toggleSidebar,
        setSidebar,
        closeMobileSidebar,
        openMobileSidebar,
        // Computed state for simplicity in components
        isSidebarExpanded: isMobile ? mobileSidebarOpen : sidebarOpen
    }
}
