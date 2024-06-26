/** 当前页面所需所有类型声明 **/

import { Role, UserBasicInfoParam } from "@/models/index.type";

export type { UserBasicInfoParam, Res } from "@/models/index.type";

// 列表table的数据类型
export type TableRecordData = {
  key?: number;
  EmployeeID: string; // 用户ID
  name: string; // 姓名
  Gender: string; // 性别
  BirthDay: string; // 出生日期
  HireDate: string; // 入职日期
  IDCard: string; // 身份证
  Address: string; // 地址
  serial?: number; // 序号
  EmployeeName: string; // 用户名
  Password: string; // 密码
  Phone: string | number; // 手机
  email?: string; // 邮箱
  Note: string; // 描述
  conditions: number; // 是否启用 1启用 -1禁用
  control?: number; // 控制，传入的ID
  roles?: number[]; // 拥有的所有权限ID
  Position: string; // 职位
};

export type Page = {
  pageNum: number;
  pageSize: number;
  total: number;
};

export type operateType = "add" | "see" | "up";

export type ModalType = {
  operateType: operateType;
  nowData: UserBasicInfoParam | null;
  modalShow: boolean;
  modalLoading: boolean;
};

export type SearchInfo = {
  username: string | undefined; // 用户名
  conditions: number | undefined; // 状态
};

export type RoleTreeInfo = {
  roleData: Role[]; // 所有的角色数据
  roleTreeLoading: boolean; // 控制树的loading状态，因为要先加载当前role的菜单，才能显示树
  roleTreeShow: boolean; // 角色树是否显示
  roleTreeDefault: number[]; // 用于角色树，默认需要选中的项
};
