// 请求返回数据 
export type TableOrderData = {
    order_id: number,
    Gus_id: string,
    room_id: number,
    prices: string | number | null,
    isable: number,
    createtime: string,
    updatetime: string,
    stime: string,
    etime: string,
    notes: string,
    rt_id: number,
    type_name: string,
    note: string,
    price: string | number | null,
    number: number,
    Gus_name: string,
    Phone: string | number,
    IDCard: string
}

// 分页相关参数
export type Page = {
    pageNum: number;
    pageSize: number;
    total: number;
};

export type operateType = "add" | "see" | "up";

export type ModalType = {
    operateType: operateType;
    nowData: TableOrderData | null;
    modalShow: boolean;
    modalLoading: boolean;
};