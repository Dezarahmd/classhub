import { createContext, useContext } from "react";

export const MembershipContext = createContext(null)

export function useMembership(){
    return useContext(MembershipContext)
}