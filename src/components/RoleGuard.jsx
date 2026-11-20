import { Navigate } from "react-router";
import { useMembership } from "../contexts/MembershipContext";
import { canManageMembers } from "../utils/permissions";

export default function RoleGuard({children}){
    const membership = useMembership()
    const role = membership?.role
    const isAllowed = canManageMembers(role)

    if (isAllowed === false) {
        return <Navigate to="/" replace/>
    }

    return children
}