// hooks/useCompanies.js
import api from "@/lib/services/axios";
import { useAuthStore } from "@/stores/useAuthStore";
// import { useLeadStatusStore } from "@/stores/useLeadStatusStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCompanies = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthStore();
    // const setRoleLabels = useLeadStatusStore((s) => s.setRoleLabels);

    // Get all companies in pagination
    const companiesQuery = (params) => {
        const filteredParams = Object.fromEntries(
            Object.entries(params || {}).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );

        return useQuery({
            queryKey: ['companies', filteredParams],
            queryFn: () => api.get(`/company/list`, { params: filteredParams }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(err?.message || 'Failed to fetch Companies');
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['companies'] });
            }
        });
    }

    // Create Company
    const createNewCompany = useMutation({
        mutationFn: (data) => api.post('/company/create', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
            toast.success('Company created successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to create Company');
        }
    })

    // Update Company
    const updateCompany = useMutation({
        mutationFn: ({ id, data }) => api.patch(`/company/update/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
            toast.success('Company updated successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to update Company');
        }
    })

    // get company details
    const getCompanyDetails = (id) => {
        return useQuery({
            queryKey: ["company", id],
            enabled: Boolean(id),
            queryFn: async () => {
                const res = await api.get(`/company/getCompanyDetails/${id}`).then(res => res.data);
                return res;
            },
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(err?.response?.data?.message || "Failed to get Company details");
            },
        });
    };

    // record manual payment
    const recordManualPayment = useMutation({
        mutationFn: ({ id, data }) => api.post(`/billing/subscription/${id}/manual-payment/`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companies'] });
            toast.success('Payment record updated successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to update payment.');
        }
    });

    // get company attendance config
    const getAttendanceConfig = () => {
        return useQuery({
            queryKey: ["attendanceConfig"],
            queryFn: () => api.get(`/companyAttendanceConfig`).then(res => res.data),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(err?.response?.data?.message || "Failed to get Company Attendance Config");
            },
        });
    };

    const createAttendanceConfig = useMutation({
        mutationFn: ({ data }) => api.post(`/companyAttendanceConfig/create`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendanceConfig'] });
            toast.success('Company Attendance Configurations created.');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to create Attendance Configurations.');
        }
    });

    const updateAttendanceConfig = useMutation({
        mutationFn: ({ data }) => api.patch(`/companyAttendanceConfig/update`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendanceConfig'] });
            toast.success('Company Attendance Configurations updated.');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Failed to update Attendance Configurations.');
        }
    });

    // get role labels config
    const getRoleLabelsConfig = () => {
        return useQuery({
            queryKey: ["roleLabelsConfig"],
            queryFn: () =>
                api.get("/company/role-labels").then(res => {
                    // console.log("Response: ", res.data?.data);
                    // setRoleLabels(res.data?.data);
                    return res.data;
                }),
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(
                    err?.response?.data?.message ||
                    "Failed to get Role Labels Config"
                );
            }
        });
    };

    // create role labels (initialize)
    const createRoleLabelsConfig = useMutation({
        mutationFn: () => api.get("/company/role-labels/create"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roleLabelsConfig"] });
            toast.success("Role labels initialized");
        },
        onError: (err) => {
            toast.error(
                err?.response?.data?.message ||
                "Failed to initialize role labels"
            );
        }
    });

    // update role labels
    const updateRoleLabelsConfig = useMutation({
        mutationFn: ({ data }) =>
            api.patch("/company/role-labels/update", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roleLabelsConfig"] });
            toast.success("Role labels updated");
        },
        onError: (err) => {
            toast.error(
                err?.response?.data?.message ||
                "Failed to update role labels"
            );
        }
    });

    // GET COMPANY STORAGE
    const companyStorageQuery = () => {
        return useQuery({
            queryKey: ["companyStorage"],
            queryFn: () => api.get("/company/storage"),
            staleTime: 1000 * 60 * 2,
            onError: (err) => {
                toast.error(
                    err?.response?.data?.message ||
                    "Failed to fetch storage"
                );
            }
        });
    };
    //   const logoRes = await fetch(
    //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/company/public/logo/${user.company}`
    //   );
    //   const logoData = await logoRes.json();

    const getCompanyLogo = () => {
        return useQuery({
            queryKey: ["companyLogo", user.company],
            queryFn: async () => {
                const res = await api.get(`/company/public/logo/${user.company}`).then(res => res.data);
                return res;
            },
            keepPreviousData: true,
            staleTime: 1000 * 60 * 5,
            onError: (err) => {
                toast.error(err?.response?.data?.message || "Failed to get Company Logo");
            },
        });
    };


    return {
        companiesQuery,
        createNewCompany,
        updateCompany,
        getCompanyDetails,
        recordManualPayment,
        getCompanyLogo,

        // attendance configurations
        getAttendanceConfig,
        createAttendanceConfig,
        updateAttendanceConfig,

        // role label config
        getRoleLabelsConfig,
        createRoleLabelsConfig,
        updateRoleLabelsConfig,

        companyStorageQuery
    }
}


export async function checkCompanyUnique(companyId) {
    if (!companyId) return { available: false, raw: null };
    try {
        const res = await api.get('/company/check-unique', { params: { companyId } });
        // tolerant parsing: your backend may return different shapes
        const data = res?.data;
        const available = data?.data?.available ?? data?.available ?? (data?.success && !data?.exists) ?? false;
        return { available: Boolean(available), raw: res };
    } catch (err) {
        // rethrow so caller can handle
        throw err;
    }
}
