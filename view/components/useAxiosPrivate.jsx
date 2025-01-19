import axios, { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken()
    const { auth } = useAuth();

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequeust = error?.config;
                if (error?.response?.status === 403 && !prevRequeust?.sent) {
                    prevRequeust.sent = true
                    const newAccessToken = await refresh();
                    prevRequeust.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequeust);
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axiosPrivate.interceptors.response.eject(responseIntercept);
            axiosPrivate.interceptors.request.eject(requestIntercept);
        }
    }, [auth, refresh])

    return axiosPrivate
}

export default useAxiosPrivate