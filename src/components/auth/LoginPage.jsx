'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Box, Button, TextField, FormControl, FormHelperText, InputAdornment, IconButton, } from '@mui/material'
import { useForm } from 'react-hook-form'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from "uuid";
import { getDeviceInfo } from '@/utils/device'
import Link from 'next/link'
import { USERTYPE } from '@/lib/constants'
import LoginWithAnotherAccount from './LoginWithAnotherAccount'

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const { user, setAuth, initializeAuth } = useAuthStore();

    // useForm hook
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: { uniqueId: '', password: '' },
    })

    // initialize auth
    useEffect(() => {
        initializeAuth();
    }, []);

    const handleContinue = () => {
        if (!user) return;

        if (user.systemRole === USERTYPE.ADMIN) {
            router.push('/dashboard/companies');
        } else {
            router.push('/dashboard');
        }
    };


    // earlier in file
    const deviceIdKey = "crm_device_id";
    let _deviceId = null;
    if (typeof window !== "undefined") {
        _deviceId = localStorage.getItem(deviceIdKey) || null;
        if (!_deviceId) {
            _deviceId = uuidv4();
            localStorage.setItem(deviceIdKey, _deviceId);
        }
    }

    // Login api call
    const onSubmit = async (data) => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const deviceInfo = getDeviceInfo(); // { isMobile, isTablet, platform, name? }

            const payload = {
                uniqueId: data.uniqueId,
                password: data.password,
                deviceId: _deviceId,
                deviceType: deviceInfo.isMobile ? "mobile" : deviceInfo.isTablet ? "tablet" : "desktop",
                deviceName: deviceInfo.name || deviceInfo.platform || null
            };

            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, payload)
            if (!res?.data) throw new Error("Invalid response");

            const resp = res.data;
            const userData = resp.data?.user;
            console.log(userData)
            const token = resp.data?.accessToken;
            const sessionId = resp.data?.sessionId;

            setAuth(userData, token, sessionId);

            // redirect to dashboard
            if (userData.systemRole === USERTYPE.ADMIN) {
                router.push('/dashboard/companies');
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.log("Error:", error?.response?.data?.message || error?.message);
            setErrorMessage(error?.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-card2">
            {/* Left Side - Background Image */}
            <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)'
                    }}
                >
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/40"></div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/60"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-16 text-white tracking-tighter">
                    <div className="max-w-lg">
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Transform Your <span className="text-red-300">Restaurant Operations</span>
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                            Experience the power of a modern POS and management system to streamline your kitchen, serve customers faster, and grow your business.
                        </p>

                        {/* Features List */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <span className="text-blue-300">✓</span>
                                </div>
                                <span className="text-blue-100 text-lg">Point of Sale & Billing</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <span className="text-blue-300">✓</span>
                                </div>
                                <span className="text-blue-100 text-lg">Kitchen Display & Automation</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <span className="text-blue-300">✓</span>
                                </div>
                                <span className="text-blue-100 text-lg">Analytics & Reports</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Right Side - Login Form */}
            <div 
                className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12 relative bg-cover bg-center bg-no-repeat lg:bg-none!"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
                }}
            >
                {/* Mobile Background Overlays (hidden on large screens) */}
                <div className="absolute inset-0 bg-black/50 lg:hidden block"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/60 lg:hidden block"></div>

                <div className="bg-card rounded-2xl border border-border p-4 sm:p-7 max-w-md w-full relative z-10 shadow-2xl">
                    {/* Logo */}
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <img
                            src="/logo2L.png"
                            alt="Logo"
                            className="h-12 object-contain rounded-sm"
                        />

                        {/* <img
                            src="/logo2DT.png"
                            alt="Logo"
                            className="h-18 object-contain rounded-sm hidden dark:block"
                        /> */}
                    </div>

                    {user ? (
                        // CONTINUE CARD
                        <div className="mt-6 flex justify-center">
                            <div
                                onClick={handleContinue}
                                className="
                                    w-full max-w-sm cursor-pointer rounded-2xl
                                    border-2 border-solid border-black
                                    //bg-gradient-to-b from-blue-100 via-blue-50 to-blue-100
                                    p-4 shadow-sm transition-all duration-200
                                    active:scale-[0.98]
                                    "
                            >
                                {/* Profile wrapper */}
                                <div className="flex flex-col items-center rounded-xl border-2 border-dotted border-black p-4">

                                    {/* Avatar */}
                                    <div className="h-24 w-24 rounded-full border-2 //bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-black text-4xl font-bold shadow-">
                                        {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                                    </div>

                                    {/* User info */}
                                    <div className="mt-3 text-center">
                                        <p className="text-lg font-semibold text-gray-800">
                                            {user?.name || "User"}
                                        </p>

                                        {user?.email && (
                                            <p className="text-sm text-gray-600 mt-0.5">
                                                {user.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="mt-4 flex flex-col gap-3">
                                    <div className="w-full rounded-lg bg-black hover:bg-black/85 py-2 text-center text-white font-medium tracking-wide">
                                        Continue
                                    </div>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <LoginWithAnotherAccount />
                                    </div>
                                </div>
                            </div>
                        </div>

                    ) : (
                        /* LOGIN FORM */
                        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                            {/* Unique ID */}
                            <FormControl fullWidth margin="normal" error={Boolean(errors.uniqueId)}>
                                <TextField
                                    {...register('uniqueId', { required: 'Unique ID is required' })}
                                    variant="outlined"
                                    label="Unique ID"
                                    placeholder="Enter your unique id"
                                    error={Boolean(errors.uniqueId)}
                                />
                                {errors.uniqueId && <FormHelperText>{errors.uniqueId.message}</FormHelperText>}
                            </FormControl>

                            {/* Password */}
                            <FormControl fullWidth margin="normal" error={Boolean(errors.password)}>
                                <TextField
                                    variant="outlined"
                                    label="Password"
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', { required: 'Password is required' })}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={showPassword ? 'hide the password' : 'display the password'}
                                                    onClick={() => setShowPassword((s) => !s)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    error={Boolean(errors.password)}
                                />
                                {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                            </FormControl>

                            {errorMessage &&
                                <p className='text-red-500 text-sm text-center mt-3'>{errorMessage}</p>
                            }

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3 }}
                                disabled={loading}
                                loading={loading}
                                color="primary"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>

                            {/* Policy Links */}
                            <div className="mt-6 pt-4 border-t border-border">
                                <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500">
                                    <Link
                                        href="/privacyPolicy"
                                        className="hover:text-gray-700 transition-colors duration-200"
                                    >
                                        Privacy Policy
                                    </Link>
                                    <span className="text-gray-400">•</span>
                                    <Link
                                        href="/terms-and-conditions"
                                        className="hover:text-gray-700 transition-colors duration-200"
                                    >
                                        Terms & Conditions
                                    </Link>
                                    <span className="text-gray-400">•</span>
                                    <Link
                                        href="/refund-and-cancellation"
                                        className="hover:text-gray-700 transition-colors duration-200"
                                    >
                                        Refund Policy
                                    </Link>
                                    <span className="text-gray-400">•</span>
                                    <Link
                                        href="/about"
                                        className="hover:text-gray-700 transition-colors duration-200"
                                    >
                                        About Us
                                    </Link>
                                    <span className="text-gray-400">•</span>
                                    <Link
                                        href="https://www.browndevs.com/contact-us"
                                        className="hover:text-gray-700 transition-colors duration-200"
                                    >
                                        Contact Us
                                    </Link>
                                </div>

                                {/* Copyright */}
                                <div className="text-center mt-3">
                                    <p className="text-xs text-gray-400">
                                        © {new Date().getFullYear()} Brown Devs. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </Box>
                    )}

                </div>
            </div>
        </div>
    )
}