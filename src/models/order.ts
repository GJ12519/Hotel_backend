/**
 * 基础model,系统权限相关功能
 * 在src/store/index.js 中被挂载到store上，命名为 sys
 * **/

import axios from "@/util/axios"; // 自己写的工具函数，封装了请求数据的通用接口
import qs from "qs";
import { message } from "antd";
import { Dispatch } from "@/store";

// 导入类型
import { GusMsg } from "@/server/modules/interface/type";
import { GusState, ValuesType } from "./index.type";

// 导入接口
import { getOrderMsg } from "@/server/modules/getorder";

const defaultState: GusState = {
    gusmsg: [], // 所有用户的信息
};

export default {
    state: defaultState,
    reducers: {
        // 保存所有用户信息
        getgusmsg(state: GusState, payload: GusMsg.List[]): GusState {
            return { ...state, gusmsg: payload };
        },
    },

    effects: (dispatch: Dispatch) => ({
        /**
         * 条件分页查询所有订单信息
         * **/
        async getOrder(params: {
            pageNum: number,
            pageSize: number
        }) {
            try {
                const res = await getOrderMsg(params);
                if (res) {
                    console.log('所有订单信息', res?.data);
                    const result = res?.data
                    return result;
                }
            } catch (err) {
                message.error("网络错误，请重试");
            }
        },
    }),
};
