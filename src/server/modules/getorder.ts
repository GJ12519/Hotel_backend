import hyRequest from "..";

// 获取订单的信息
export const getOrderMsg = (params: {
    pageNum: number,
    pageSize: number
}) => {
    return hyRequest.get({ url: '/orderadmin/order', params })
}