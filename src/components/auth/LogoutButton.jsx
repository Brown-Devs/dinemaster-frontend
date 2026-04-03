"use client"

import { Button } from '@mui/material'
import React, { useState } from 'react'
import LogoutDialog from './LogoutDialog'
import LogoutIcon from "@mui/icons-material/Logout";

function LogoutButton() {
    const [open, setOpen] = useState(false)

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <>
            <Button
                className='w-full'
                variant="contained"
                startIcon={<LogoutIcon />}
                onClick={handleOpen}
            >
                Logout
            </Button>
            <LogoutDialog
                open={open}
                onClose={handleClose}
            />
        </>
    )
}

export default LogoutButton