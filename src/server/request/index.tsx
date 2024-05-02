import axios from 'axios';
import type { AxiosInstance } from "axios";
import { HYRequestConfig } from "./type";
import { useNavigate } from 'react-router-dom'; // 假设你使用的是react-router-dom 

class HYRequest {
    instance: AxiosInstance;

    constructor(config: HYRequestConfig) {
        this.instance = axios.create(config)

        /* 对每个instance实例都添加拦截器 */
        /* 请求拦截 */
        this.instance.interceptors.request.use(config => {
            // console.log('全局请求成功的拦截');
            const token = localStorage.getItem('token')
            if (token) {
                config.headers.Authorization = `${token}`;
            }
            return config
        }, err => {
            console.log('全局请求拦截失败');
            return err
        })
        /* 响应拦截 */
        this.instance.interceptors.response.use(res => {
            // console.log('全局响应成功的拦截');
            return res
        }, err => {
            const { response } = err;
            if (response && response.status === 401) {
                // 401错误处理逻辑  
                const navigate = useNavigate();
                // 清除token或执行其他逻辑  
                // ...  
                // 重定向到登录页面  
                navigate('/login');
            }
            return Promise.reject(err);
        })

        /* 针对特定的hyrequest实例添加拦截器 */
        this.instance.interceptors.request.use(
            config.interceptors?.requestSuccessFn,
            config.interceptors?.requestFailureFn
        )
        this.instance.interceptors.response.use(
            config.interceptors?.responseSuccessFn,
            config.interceptors?.responseFailureFn
        )
    }

    /* 封装网络请求的方法 */
    request<T = any>(config: HYRequestConfig<T>) {

        config.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        /* 单次请求的拦截处理 */
        if (config.interceptors?.requestSuccessFn) {
            config = config.interceptors.requestSuccessFn(config as any)
        }
        return new Promise<T>((resolve, reject) => {
            this.instance.request<any, T>(config).then(res => {
                /* 单次响应的拦截处理 */
                if (config.interceptors?.responseSuccessFn) {
                    res = config.interceptors.responseSuccessFn(res)
                }
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    get<T = any>(config: HYRequestConfig<T>) {
        return this.request({ ...config, method: "GET" })
    }
    post<T = any>(config: HYRequestConfig<T>) {
        console.log("config", { ...config });
        return this.request({ ...config, method: "POST" })
    }
    delete<T = any>(config: HYRequestConfig<T>) {
        return this.request({ ...config, method: "DELETE" })
    }
    patch<T = any>(config: HYRequestConfig<T>) {
        return this.request({ ...config, method: "PATCH" })
    }
}

export default HYRequest