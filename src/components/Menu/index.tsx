/** 左侧导航 **/

// ==================
// 第三方库
// ==================
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Layout, Menu as MenuAntd } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cloneDeep } from "lodash";

const { Sider } = Layout;

// ==================
// 自定义的东西
// ==================
import "./index.less";
import ImgLogo from "@/assets/hotel.png";
import Icon from "@/components/Icon";
import Icon_All from "@/util/icon";

// import icon

// ==================
// 类型声明
// ==================
import type { Menu } from "@/models/index.type";
import type { ItemType } from "antd/lib/menu/hooks/useItems";
import { UserMessage } from "@/server/modules/interface/type";

interface Props {
  data: UserMessage.Menu[]; // 所有的菜单数据
  collapsed: boolean; // 菜单咱开还是收起
}

// ==================
// 本组件
// ==================
export default function MenuCom(props: Props): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [chosedKey, setChosedKey] = useState<string[]>([]); // 当前选中
  const [openKeys, setOpenKeys] = useState<string[]>([]); // 当前需要被展开的项

  // 当页面路由跳转时，即location发生改变，则更新选中项
  useEffect(() => {
    const paths = location.pathname.split("/").filter((item) => !!item);
    setChosedKey([location.pathname]);
    setOpenKeys(paths.map((item) => `/${item}`));
  }, [location]);

  // ==================
  // 私有方法
  // ==================

  // 菜单被选择
  const onSelect = (e: any) => {
    console.log('ecsjuihjkadf', e);

    if (e?.key) {
      navigate(e.key);
    }
  };

  // 工具 - 递归将扁平数据转换为层级数据
  const dataToJson = useCallback(
    (one: UserMessage.Menu | undefined, data: UserMessage.Menu[]): UserMessage.Menu[] | undefined => {
      let kids;
      if (!one) {
        // 第1次递归
        kids = data.filter((item: UserMessage.Menu) => !item.ParentMenuID);
      } else {
        kids = data.filter((item: UserMessage.Menu) => item.ParentMenuID === one.MenuID);
      }
      kids.forEach((item: UserMessage.Menu) => (item.children = dataToJson(item, data)));

      // console.log(kids);

      return kids.length ? kids : undefined;
    },
    []
  );

  // 构建树结构
  const makeTreeDom = useCallback((data: UserMessage.Menu[]): any => {
    return data.map((item: UserMessage.Menu) => {
      if (item.children) {
        return {
          key: item.MenuLink,
          label:
            !item.ParentMenuID && item.Menu_icon ? (
              <span>
                <Icon_All type={item.Menu_icon} />
                <span>{item.MenuName}</span>
              </span>
            ) : (
              item.MenuName
            ),
          children: makeTreeDom(item.children),
        };
      } else {
        return {
          label: (
            <>
              {!item.ParentMenuID && item.Menu_icon ? <Icon type={item.Menu_icon} /> : null}
              <span>{item.MenuName}</span>
            </>
          ),
          key: item.MenuLink,
        };
      }
    });
  }, []);

  // ==================
  // 计算属性 memo
  // ==================

  /** 处理原始数据，将原始数据处理为层级关系 **/
  const treeDom: ItemType[] = useMemo(() => {
    const d: UserMessage.Menu[] = cloneDeep(props.data);
    // 按照sort排序
    d.sort((a, b) => {
      return a.Sort - b.Sort;
    });
    const sourceData: UserMessage.Menu[] = dataToJson(undefined, d) || [];
    const treeDom = makeTreeDom(sourceData);
    return treeDom;
  }, [props.data, dataToJson, makeTreeDom]);

  return (
    <Sider
      width={256}
      className="sider"
      trigger={null}
      collapsible
      collapsed={props.collapsed}
    >
      <div className={props.collapsed ? "menuLogo hide" : "menuLogo"}>
        <Link to="/">
          <img src={ImgLogo} />
          <div>星旺酒店</div>
        </Link>
      </div>
      <MenuAntd
        theme="dark"
        mode="inline"
        items={treeDom}
        selectedKeys={chosedKey}
        {...(props.collapsed ? {} : { openKeys })}
        onOpenChange={(keys: string[]) => setOpenKeys(keys)}
        onSelect={onSelect}
      />
    </Sider>
  );
}
