import hyRequest from "../index"
import { UserBasicInfoParam } from "@/models/index.type";

// 获取员工的信息
export const getuserlist = (params: {
    pageNum: number;
    pageSize: number;
    username?: string;
    conditions?: number;
}) => {
    return hyRequest.get({ url: '/system/useradmin', params })
}

// 添加员工
export const addHUse = (data: UserBasicInfoParam) => {
    console.log('data1', data);

    return hyRequest.post({ url: "/system/addhusers", data })
}

// 修改员工信息
export const upHUser = (data: UserBasicInfoParam) => {
    console.log('data1', data);

    return hyRequest.post({ url: "/system/uphuser", data })
}

// 删除员工
export const delUsers = (data: {
    id: string
}) => {
    console.log('data1', data);

    return hyRequest.post({ url: "/system/deluse", data })
}

// 获取角色信息
export const getRole = (data: {
    pageNum: number;
    pageSize: number;
}) => {
    return hyRequest.post({ url: "/systems/getrole", data })
}

// 修改角色信息
export const upHRole = (data: {
    RoleName: string,
    conditions: number,
    desc: string,
    id: number
}) => {
    return hyRequest.post({ url: "/systems/uprole", data })
}


// 用户获取角色
export const getrrole = () => {
    return hyRequest.post({ url: "/system/getroles" })
}


// 分配角色
export const addRole = (data: {
    id: string,
    keys: number[]
}) => {
    return hyRequest.post({ url: '/system/addrole', data })
}