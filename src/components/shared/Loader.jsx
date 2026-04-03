import React from 'react'
import { CircularProgress } from "@mui/material";

function Loader() {
    return (
        <div className="border border-gray-200 w-full rounded-2xl py-10 bg-card space-y-4 h-50 flex items-center justify-center">
            <CircularProgress />
        </div>
    )
}

export default Loader
