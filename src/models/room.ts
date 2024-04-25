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
import { getRoomMsg, getRoomuse, reserve, checkin } from "@/server/modules/getroom";

const defaultState: GusState = {
    gusmsg: [], // 所有用户的信息
};

export default {
    state: defaultState,
    reducers: {
        // 保存所有用户信息
        reduceRoomMsg(state: GusState, payload: GusMsg.List[]): GusState {
            return { ...state, gusmsg: payload };
        },
    },

    effects: (dispatch: Dispatch) => ({
        /**
         * 条件分页查询所有房间及租客的信息
         * **/
        async getroommsg() {
            try {
                const res = await getRoomMsg();
                if (res) {
                    console.log('所有租客的信息', res?.data?.results);
                    // const result = res?.data?.results
                    // console.log(result);

                    return res.data;
                }
            } catch (err) {
                message.error("网络错误，请重试");
            }
        },
        async getroomuse(userID: string) {
            try {
                const res = await getRoomuse(userID)
                // console.log(',',res);

                return res.data
            } catch {
                message.error("网络错误，请重试");
            }
        },
        async reserve(data: ValuesType) {
            // console.log('s');
            try {
                const res = await reserve(data)
                console.log('哈哈哈', res);
                return res.data

            } catch (error) {
                console.log(error);
                message.error("网络错误，请重试");
            }

        },
        async checkin(data: ValuesType) {
            // console.log('s');
            try {
                const res = await checkin(data)
                console.log('哈哈哈2', res);
                return res
            } catch {
                message.info('网络错误，请重试')
            }
        }
    }),
};
