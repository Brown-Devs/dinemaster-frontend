"use client"

import { Button, Switch } from '@mui/material'
import React, { useState } from 'react'
import LogoutDialog from './LogoutDialog'
import { HiLogin } from 'react-icons/hi';

function LoginWithAnotherAccount() {
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
                startIcon={<HiLogin />}
                onClick={handleOpen}
            >
                Login with another account
            </Button>
            <LogoutDialog
                content={{
                    title: "Another Account",
                    heading: "Are you sure you want to login with another account?",
                    btn1: "Cancel",
                    btn2: "Proceed"
                }}
                open={open}
                onClose={handleClose}
            />
        </>
    )
}

export default LoginWithAnotherAccount