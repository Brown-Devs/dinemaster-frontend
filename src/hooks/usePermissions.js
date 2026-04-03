"use client";
import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/lib/services/axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function usePermissions() {
    const { user } = useAuthStore();
    // console.log(user)

    const abcd = useQuery({
        queryKey: ["userPermissions"],
        queryFn: () => api.get(`/users/${user._id}/getPermissions`),
        enabled: !!user?._id,
        staleTime: 1000 * 60, // 1 minute cache
        onError: (err) => {
            toast.error(err?.response?.data?.message || err.message || "Failed to fetch permissions");
        },
    });

    const userPermissions = abcd.data?.data?.data?.user?.permissions;
    const companyPermissions = abcd.data?.data?.data?.user?.modules;

    // helper function to check permission
    const isModuleEnabled = (permission) => {
        // console.log("company modules: ",companyPermissions);
        // console.log("requested module: ",permission);
        if (user.systemRole === 'super_admin') return true;
        return companyPermissions?.includes(permission) || permission == "modules.base";
    };

    // helper function to check permission
    const checkPermission = (permission) => {
        if (user?.systemRole === 'super_admin' || user?.systemRole === 'admin') return true; // admin has all permissions

        if (!permission || !userPermissions) return false;
        return userPermissions.includes(permission);
    };

    return {
        permissions: userPermissions || [],
        isModuleEnabled,
        checkPermission,
    };
}
