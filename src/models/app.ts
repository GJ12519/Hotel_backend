/**
 * 基础model
 * 在src/store/index.js 中被挂载到store上，命名为 app
 * **/

import axios from "@/util/axios"; // 自己写的工具函数，封装了请求数据的通用接口
import { message } from "antd";
import { Dispatch, RootState } from "@/store";
import { userlogin, getrole, getmenu, getpower } from "@/server/modules/users_login";
import { Login } from "@/server/modules/interface/type"
import tools from "@/util/tools";

import {
  Menu,
  Role,
  Power,
  MenuAndPower,
  UserInfo,
  AppState,
  Res,
} from "./index.type";
import { any, string } from "prop-types";

const defaultState: AppState = {
  userinfo: {
    roles: [], // 当前用户拥有的角色
    menus: [], // 当前用户拥有的已授权的菜单
    powers: [], // 当前用户拥有的权限数据
    userBasicInfo: null, // 用户的基础信息，id,用户名...
  }, // 当前用户基本信息
  powersCode: [], // 当前用户拥有的权限code列表(仅保留了code)，页面中的按钮的权限控制将根据此数据源判断
};
export default {
  state: defaultState,
  reducers: {
    reducerUserInfo(state: AppState, payload: UserInfo) {
      // console.log("payload", payload);
      return {
        ...state,
        userinfo: payload,
        powersCode: payload.powers.map((item) => item.code),
      };
    },
    reducerLogout(state: AppState) {
      return {
        ...state,
        userinfo: {
          menus: [],
          roles: [],
          powers: [],
        },
      };
    },
  },

  effects: (dispatch: Dispatch) => ({
    /**
     * 登录
     * @param { username, password } params
     * */
    async onLogin(params: { username: string; password: string }, rootState: RootState) {
      //这里是直接调用的接口
      try {
        const userinfo: UserInfo = rootState.app.userinfo;
        // console.log("这是userinfo的信息", userinfo);

        /* 此处强加类型断言，后续需要再来修改 */
        const res: Res = await userlogin(params) as any
        const results = res?.data.users
        // console.log("axios返回的信息", res);

        /* 保存用户信息 */
        await dispatch({
          type: "app/reducerUserInfo",
          payload: { ...userinfo, userBasicInfo: results }
        })
        // 获取角色,菜单,权限信息
        await dispatch.app.updateUserInfo(null)
        return res?.data
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },
    /**
     * 退出登录
     * @param null
     * **/
    async onLogout() {
      try {
        // 同 dispatch.app.reducerLogout();

        dispatch({ type: "app/reducerLogout", payload: null });
        sessionStorage.removeItem("userinfo");
        return "success";
      } catch (err) {
        message.error("网络错误，请重试");
      }
      return;
    },
    /**
     * 设置用户信息
     * @param: {*} params
     * **/
    async setUserInfo(params: UserInfo) {
      dispatch.app.reducerUserInfo(params);
      sessionStorage.setItem(
        "userinfo",
        tools.compile(JSON.stringify(params))
      );
      return "success";
    },

    /** 修改了角色/菜单/权限信息后需要更新用户的roles,menus,powers数据 **/
    async updateUserInfo(payload: null, rootState: RootState): Promise<any> {
      /** 2.重新查询角色信息 **/
      const userinfo: UserInfo = rootState.app.userinfo;
      const ID = userinfo.userBasicInfo?.EmployeeID
      const userID = { userID: ID }

      if (userID) {
        const roles = await getrole(userID as any)
        // 获取角色的ID
        const RoleID = { RoleID: roles.data?.results[0].RoleID }
        const menus = await getmenu(RoleID as any)
        const powers = await getpower(RoleID as any)
        console.log("powers", powers.data?.results, "roles", roles.data?.results[0], "menus", menus.data?.results);

        this.setUserInfo({
          ...userinfo,
          roles: roles.data?.results[0],
          menus: menus.data?.results,
          powers: powers.data?.results
        });
      }
      // console.log(rootState.app.userinfo);

      // const res2: Res | undefined = await dispatch.sys.getRoleById({
      //   id: userinfo.roles.map((item) => item.id),
      // });
      // if (!res2 || res2.status !== 200) {
      //   // 角色查询失败
      //   return res2;
      // }

      // const roles: Role[] = res2.data.filter(
      //   (item: Role) => item.conditions === 1
      // );

      // /** 3.根据菜单id 获取菜单信息 **/
      // const menuAndPowers = roles.reduce(
      //   (a, b) => [...a, ...b.menuAndPowers],
      //   [] as MenuAndPower[]
      // );
      // const res3: Res | undefined = await dispatch.sys.getMenusById({
      //   id: Array.from(new Set(menuAndPowers.map((item) => item.menuId))),
      // });
      // if (!res3 || res3.status !== 200) {
      //   // 查询菜单信息失败
      //   return res3;
      // }
      // const menus: Menu[] = res3.data.filter(
      //   (item: Menu) => item.conditions === 1
      // );

      // /** 4.根据权限id，获取权限信息 **/
      // const res4: Res | undefined = await dispatch.sys.getPowerById({
      //   id: Array.from(
      //     new Set(
      //       menuAndPowers.reduce((a, b) => [...a, ...b.powers], [] as number[])
      //     )
      //   ),
      // });
      // if (!res4 || res4.status !== 200) {
      //   // 权限查询失败
      //   return res4;
      // }
      // const powers: Power[] = res4.data.filter(
      //   (item: Power) => item.conditions === 1
      // );
      // this.setUserInfo({
      //   ...userinfo,
      //   roles,
      //   menus,
      //   powers,
      // });
      // return;
    },
  }),
};
