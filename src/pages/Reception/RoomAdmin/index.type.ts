// 获取到的客房信息类型
export type RoomRecordData = {
    room_id: number,
    room_floor: number,
    rt_id: number,
    userID: string | null,
    isable: number,
    createtime: string,
}

// 该页面所需数据
export type RoomUserData = {
    room_id: number,
    room_floor: number,
    rt_id: number,
    userID: string | null,
    isable: number,
    createtime: string,
    updatetime: string,
    etime?: string,
    stime?: string,
    Gus_name: string,
    Phone: string,
    IDCard: string,
}


// 模态框
export type operateType = "Details" | "Reserve" | "Checkin" | "clean";

export type ModalType = {
    operateType: operateType;
    nowData: RoomUserData | null;
    modalShow: boolean;
    modalLoading: boolean;
};

// values
export type ValuesType = {
    stime: string | null,
    etime: string | null,
    IDCard: string | null,
    conditions: number,
    phone: number,
    room: number,
    name: string
}
