import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios"

interface HYInterceptors<T = AxiosResponse> {
    requestSuccessFn?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
    requestFailureFn?: (err: any) => any
    responseSuccessFn?: (config: T) => T
    responseFailureFn?: (err: any) => any
}

export interface HYRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
    interceptors?: HYInterceptors<T>
}