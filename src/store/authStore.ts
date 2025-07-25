import {create} from "zustand";

export type authStoreType = {
    user: any
    loading: boolean
    isAuth: boolean,
    setLoading: (isLoading: boolean) => void
    setAuth: (isAuth: boolean) => void
    setUserAndAuth: (data: { isAuth: boolean, user: any }) => void
}

export const useAuthStore = create<authStoreType>((setState) => ({
    isAuth: false,
    user: null,
    loading: false,
    setLoading: (b) => (setState(() => ({loading: b}))),
    setAuth: (isAuth) => (setState(() => ({isAuth}))),
    setUserAndAuth: (data) => (setState(() => ({isAuth: data.isAuth, user: data.user})))
}))