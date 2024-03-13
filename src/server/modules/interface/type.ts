/* 登录接口 */

interface Users {
    Employee?: string,
    Password: null,
    EmployeeName: string,
    Birthday?: any,
    HireDate?: any,
    Position?: string,
    Phone: string,
    Address: string,
    IDCard: string | null,
    Status: string | number,
    Note: string
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Login {
    // 登录需传递信息
    export interface LoginForm {
        username: string,
        password: string
    }
    // 登录成功返回的信息
    export interface LoginData {
        status?: number,
        message?: string,
        Users: Users,
        token?: string
    }
    // 用户ID
    export interface LoginGetRole {
        userID: string | undefined
    }
    // 角色ID
    export interface LoginGetMenu {
        roleID: number | undefined
    }
}


/* 用户信息 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UserMessage {
    export interface Role {
        RoleID: string,
        RoleName: string,
        createtime: any,
        updatetime: any
    }
    export interface Menu {
        MenuID: number;
        ParentMenuID?: any;
        MenuName: string;
        Menudesc: string;
        MenuLink: string;
        Menu_icon: string;
        Sort: number;
        IsEnable: number;
        IsDisplayed: number;
        conditions: number;
        Notes?: string;
        children?: Menu[];
        title?: string;
    }
    export interface Power {
        PremissionID: number,
        PremissionName: string
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GusMsg {
    export interface List {
        Gus_id: string | null,
        Gus_password: string;
        Gus_name: string,
        Email?: string,
        Phone: number,
        IDCard: string,
        Address: string,
        createtime: string,
        updatetime: string,
        conditions: number,
        note: string
    }
}