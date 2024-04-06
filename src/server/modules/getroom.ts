import hyRequest from "../index"

// import { UserBasicInfoParam } from "@/models/index.type";
import { ValuesType } from "@/models/index.type"

/* 获取客房以及租客信息 */
export const getRoomMsg = () => {
    return hyRequest.get({ url: '/roomadmin/getroommsg' })
}

// 根据用户id获取用户信息
export const getRoomuse = (data: string) => {
    return hyRequest.post({ url: '/roomadmin/getroomuse', data })
}

// 预定
export const reserve = (data: ValuesType) => {
    console.log('接口的data', data);

    return hyRequest.post({ url: '/roomadmin/reserve', data })
}

// 入住
export const checkin = (data: ValuesType) => {
    return hyRequest.post({ url: '/roomadmin/checkin', data })
}