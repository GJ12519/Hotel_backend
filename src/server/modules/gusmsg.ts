import hyRequest from "../index"

import { UserBasicInfoParam } from "@/models/index.type";

/* 获取所有客户的信息 */
export const getguslist = (params: {
    pageNum: number;
    pageSize: number;
    Gus_id?: string;
    IDCard?: number;
    Gus_name?: string
}) => {
    return hyRequest.get({ url: '/guester/getgusmsg', params })
}

/* 修改客户信息 */
export const upGusMsg = (data: UserBasicInfoParam) => {
    console.log('jusadfh', data);

    return hyRequest.post({ url: '/guester/upgusmsg', data })
}

// 添加客户信息
export const addGus = (data: UserBasicInfoParam) => {
    console.log('接口是否拿到信息', data);
    return hyRequest.post({ url: '/guester/addgus', data })

}