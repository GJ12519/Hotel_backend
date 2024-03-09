import hyRequest from "../index"

export const getuserlist = (params: {
    pageNum: number;
    pageSize: number;
    username?: string;
    conditions?: number;
}) => {
    return hyRequest.get({ url: '/system/useradmin', params })
}