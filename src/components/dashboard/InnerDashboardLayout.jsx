import React from 'react'

function InnerDashboardLayout({ children }) {
    return (
        // <div className='w-full max-[500px]:max-w-screen overflow-x-hidden p-1 sm:p-2 scroll-smooth'>
        <div className='w-full max-w-full overflow-x-hidden p-1 sm:p-4 scroll-smooth'>
            {children}
        </div>
    )
}

export default InnerDashboardLayout
