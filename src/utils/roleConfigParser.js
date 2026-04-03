
export const getUserRoleLabel = (roleLabels, systemRole, user) => {
    return user?.role != 'Admin' ? roleLabels[systemRole || user?.systemRole] : 'Admin'
}