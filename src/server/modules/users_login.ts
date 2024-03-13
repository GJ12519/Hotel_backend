import hyRequest from "../index"
import { Login } from "./interface/type"

/* 登录接口,获取用户信息 */
export const userlogin = (data: Login.LoginForm) =>
    hyRequest.post({ url: "/login/getuser", data })

/* 根据用户id获取角色信息 */
export const getrole = (data: Login.LoginGetRole) =>
    hyRequest.post({ url: "/login/getrole", data })

/* 根据角色id获取菜单信息 */
export const getmenu = (data: Login.LoginGetMenu) =>
    hyRequest.post({ url: "/login/getmenu", data })

/* 根据角色id获取权限信息 */
export const getpower = (data: Login.LoginGetMenu) =>
    hyRequest.post({ url: "/login/getpower", data })