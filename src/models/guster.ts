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
import { GusState } from "./index.type";

// 导入接口
import { getguslist, upGusMsg, addGus } from "@/server/modules/gusmsg";

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
         * 条件分页查询所有客户信息
         * **/
        async getguslist(params: any) {
            try {
                const res = await getguslist(params);
                if (res) {
                    console.log('所有客户信息', res?.data?.results?.result);
                    const result = res?.data?.results?.result
                    dispatch.guster.getgusmsg(result);
                    return res;
                }
            } catch (err) {
                message.error("网络错误，请重试");
            }
        },

        /* 修改用户信息 */
        async upGusmsg(data: any) {
            try {
                console.log("修改用户信息拿到的data", data);

                const res = await upGusMsg(data)
                console.log('修改返回的信息', res);

                return res
            }
            catch (err) {
                message.error("网络错误，请重试");
            }
        },

        // 添加客户
        async addGus(data: any) {
            try {
                console.log('添加用户信息拿到的data', data);
                const res = await addGus(data)
                console.log('添加用户的返回信息', res);
                return res

            } catch (err) {
                message.error("网络错误，请重试");
            }
        }
    }),
};
