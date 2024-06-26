/** User 系统管理/`用户`管理 **/

// ==================
// 所需的第三方库
// ==================
import React, { useState, useMemo } from "react";
import { useSetState, useMount } from "react-use";
import { useSelector, useDispatch } from "react-redux";
import {
  Form,
  Button,
  Input,
  Table,
  message,
  Popconfirm,
  Modal,
  Tooltip,
  Divider,
  Select,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  ToolOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";

// ==================
// 所需的自定义的东西
// ==================
import tools from "@/util/tools"; // 工具函数

const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};

// 性别校验
const validateGender = (rule, value) => {
  if (!value || ['男', '女'].includes(value)) {
    return Promise.resolve();
  }
  return Promise.reject(new Error('请输入男或女'));
};

// ==================
// 所需的组件
// ==================
import RoleTree from "@/components/TreeChose/RoleTree";

// ==================
// 类型声明
// ==================
import {
  TableRecordData,
  Page,
  operateType,
  ModalType,
  SearchInfo,
  RoleTreeInfo,
  UserBasicInfoParam,
  Res,
} from "./index.type";
import { RootState, Dispatch } from "@/store";

// ==================
// CSS
// ==================
import "./index.less";

// ==================
// 本组件
// ==================
function UserAdminContainer(): JSX.Element {
  const dispatch = useDispatch<Dispatch>();
  const userinfo = useSelector((state: RootState) => state.app.userinfo);
  const p = useSelector((state: RootState) => state.app.powersCode);

  const [form] = Form.useForm();
  const [data, setData] = useState<TableRecordData[]>([]); // 当前页面列表数据
  const [loading, setLoading] = useState(false); // 数据是否正在加载中

  // 分页相关参数
  const [page, setPage] = useSetState<Page>({
    pageNum: 1,
    pageSize: 5,
    total: 0,
  });

  // 模态框相关参数
  const [modal, setModal] = useSetState<ModalType>({
    operateType: "add", // see查看，add添加，up修改
    nowData: null,
    modalShow: false,
    modalLoading: false,
  });

  // 搜索相关参数
  const [searchInfo, setSearchInfo] = useSetState<SearchInfo>({
    username: undefined, // 用户名
    conditions: undefined, // 状态
  });

  // 角色树相关参数
  const [role, setRole] = useSetState<RoleTreeInfo>({
    roleData: [],
    roleTreeLoading: false,
    roleTreeShow: false,
    roleTreeDefault: [],
  });

  // 生命周期 - 组件挂载时触发一次
  useMount(() => {
    onGetData(page);
    getAllRolesData();
  });

  // 函数 - 获取所有的角色数据，用于分配角色控件的原始数据
  const getAllRolesData = async (): Promise<void> => {
    try {
      const res = await dispatch.sys.getAllRoles();
      console.log('rs555', res);
      const res11 = res?.results.map(role => ({
        ...role, // 复制原对象的所有属性  
        title: role.RoleName, // 添加新的 title 属性，其值等于 RoleName
      }))

      if (res && res.status === 200) {
        // console.log('全部的数据吗？', res11, data);

        setRole({
          roleData: res11,
        });

      }
    } catch {
      //
    }
  };

  // 函数 - 查询当前页面所需列表数据
  async function onGetData(page: {
    pageNum: number;
    pageSize: number;
  }): Promise<void> {
    // if (!p.includes("user:query")) {
    //   return;
    // }

    const params = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      username: searchInfo.username,
      conditions: searchInfo.conditions,
    };
    setLoading(true);
    try {
      const res = await dispatch.sys.getUserList(tools.clearNull(params))
      console.log('所有用户的信息', res?.data);
      const res11 = res?.data?.results?.result

      if (res && res.data.status === 200) {
        console.log(res11, 111);

        setData(res.data.results.result);

        setPage({
          // pageNum: page.pageNum,
          // pageSize: page.pageSize,
          total: res.data.results.total,
        });
      } else {
        message.error(res?.message ?? "数据获取失败");
      }
    } finally {
      setLoading(false);
    }
  }

  // 搜索 - 名称输入框值改变时触发
  const searchUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (e.target.value.length < 20) {
      setSearchInfo({ username: e.target.value });
    }
  };

  // 搜索 - 状态下拉框选择时触发
  const searchConditionsChange = (v: number): void => {
    setSearchInfo({ conditions: v });
  };

  // 搜索
  const onSearch = (): void => {
    onGetData(page);
  };

  /**
   * 添加/修改/查看 模态框出现
   * @param data 当前选中的那条数据
   * @param type add添加/up修改/see查看
   * **/
  const onModalShow = (
    data: TableRecordData | null,
    type: operateType
  ): void => {
    setModal({
      modalShow: true,
      nowData: data,
      operateType: type,
    });
    console.log('userinbfo4545', userinfo, data);

    // 用setTimeout是因为首次让Modal出现时得等它挂载DOM，不然form对象还没来得及挂载到Form上
    setTimeout(() => {
      if (type === "add") {
        // 新增，需重置表单各控件的值
        form.resetFields();
      } else if (data) {
        console.log('dthh', data);
        const stars = Array(12).fill('*').join('');
        // 查看或修改，需设置表单各控件的值为当前所选中行的数据
        form.setFieldsValue({
          name: data.name,
          EmployeeName: data.EmployeeName,
          password: data.Password.length <= 12 ? data.Password.replace(/./g, '*') : stars,
          phone: data.Phone,
          email: data.email,
          desc: data.desc,
          conditions: data.conditions,
          address: data.address
        });
      }
    });
  };

  /** 模态框确定 **/
  const onOk = async (): Promise<void> => {
    if (modal.operateType === "see") {
      onClose();
      return;
    }
    try {
      const values = await form.validateFields();
      console.log('465644', values);


      setModal({
        modalLoading: true,
      });

      const params: UserBasicInfoParam = {
        name: values.name,  // 姓名
        EmployeeName: values.EmployeeName,  // 用户名
        Password: values.password,  // 密码
        Phone: values.phone,  // 电话
        email: values.email,  // 邮箱
        note: values.desc,  // 备注
        conditions: values.conditions,  //状态
        gender: values.sex,  // 性别
        address: values.address,  // 地址
        IDCard: values.IDCard  // 身份证
      };
      console.log(params);

      if (modal.operateType === "add") {
        // 新增
        try {
          const res: Res | undefined = await dispatch.sys.addUser(params);
          if (res && res.status === 200) {
            message.success("添加成功");
            onGetData(page);
            onClose();
          } else {
            message.error(res?.message ?? "操作失败");
          }
        } finally {
          setModal({
            modalLoading: false,
          });
        }
      } else {
        // 修改
        params.id = modal.nowData?.EmployeeID;
        try {
          const res: Res | undefined = await dispatch.sys.upUser(params);
          if (res && res.status === 200) {
            message.success("修改成功");
            onGetData(page);
            onClose();
          } else {
            message.error(res?.message ?? "操作失败");
          }
        } finally {
          setModal({
            modalLoading: false,
          });
        }
      }
    } catch {
      // 未通过校验
    }
  };

  // 删除某一条数据
  const onDel = async (id: string): Promise<void> => {
    setLoading(true);
    console.log('删除的id', id);

    try {
      const res = await dispatch.sys.delUser({ id });
      if (res && res.status === 200) {
        message.success("删除成功");
        onGetData(page);
      } else {
        message.error(res?.message ?? "操作失败");
      }
    } finally {
      setLoading(false);
    }
  };

  /** 模态框关闭 **/
  const onClose = () => {
    setModal({
      modalShow: false,
    });
  };

  /** 分配角色按钮点击，角色控件出现 **/
  const onTreeShowClick = (record: TableRecordData): void => {
    console.log('record1', record);

    setModal({
      nowData: record,
    });
    setRole({
      roleTreeShow: true,  // 开启角色树
      // roleTreeDefault: record.roles || [],
    });
  };

  // 分配角色确定
  const onRoleOk = async (keys: string[]): Promise<void> => {
    console.log('data12312321321', modal.nowData, keys);

    // if (!modal.nowData?.RoleID) {
    //   message.error("未获取到该条数据id");
    //   return;
    // }
    if (keys.length === 0) {
      keys = ''
    } else {
      keys = keys[0]
    }

    console.log('keysss', keys);


    const params = {
      id: modal.nowData.EmployeeID,
      keys: keys,
    };
    console.log('params', params);

    setRole({
      roleTreeLoading: true,
    });
    try {
      const res: Res = await dispatch.sys.setUserRoles(params);
      if (res && res.status === 200) {
        message.success("分配成功");
        onGetData(page);
        onRoleClose();
      } else {
        message.error(res?.message ?? "操作失败");
      }
    } finally {
      setRole({
        roleTreeLoading: false,
      });
    }
  };

  // 分配角色树关闭
  const onRoleClose = (): void => {
    setRole({
      roleTreeShow: false,
    });
  };

  // 表格页码改变
  const onTablePageChange = (pageNum: number, pageSize: number): void => {
    console.log(pageNum, pageSize);
    setPage({
      pageNum: pageNum,
      pageSize: pageSize,
    });
    onGetData({ pageNum: pageNum * pageSize - pageSize + 1, pageSize });
  };

  // ==================
  // 属性 和 memo
  // ==================

  // table字段
  const tableColumns = [
    {
      title: "ID",
      dataIndex: "EmployeeID",
      key: "EmployeeID",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "用户名",
      dataIndex: "EmployeeName",
      key: "EmployeeName",
    },
    {
      title: "电话",
      dataIndex: "Phone",
      key: "Phone",
    },
    {
      title: "职位",
      dataIndex: "Position",
      key: "Position",
    },
    {
      title: "状态",
      dataIndex: "conditions",
      key: "conditions",
      render: (v: number): JSX.Element =>
        v === 1 ? (
          <span style={{ color: "green" }}>在职</span>
        ) : (
          <span style={{ color: "red" }}>离职</span>
        ),
    },
    {
      title: "操作",
      key: "control",
      width: 200,
      render: (v: null, record: TableRecordData) => {
        const controls = [];
        const u = userinfo.userBasicInfo || { EmployeeID: -1 };
        p.includes("user:query") &&
          controls.push(
            <span
              key="0"
              className="control-btn green"
              onClick={() => onModalShow(record, "see")}
            >
              <Tooltip placement="top" title="查看">
                <EyeOutlined />
              </Tooltip>
            </span>
          );
        p.includes("user:up") &&
          controls.push(
            <span
              key="1"
              className="control-btn blue"
              onClick={() => onModalShow(record, "up")}
            >
              <Tooltip placement="top" title="修改">
                <ToolOutlined />
              </Tooltip>
            </span>
          );
        p.includes("user:role") &&
          u.EmployeeID !== record.EmployeeID &&
          controls.push(
            <span
              key="2"
              className="control-btn blue"
              onClick={() => onTreeShowClick(record)}
            >
              <Tooltip placement="top" title="分配角色">
                <EditOutlined />
              </Tooltip>
            </span>
          );

        // p.includes("user:del") &&
        //   u.EmployeeID !== record.EmployeeID &&
        //   controls.push(
        //     <Popconfirm
        //       key="3"
        //       title="确定删除吗?"
        //       onConfirm={() => onDel(record.EmployeeID as any)}
        //       okText="确定"
        //       cancelText="取消"
        //     >
        //       <span className="control-btn red">
        //         <Tooltip placement="top" title="删除">
        //           <DeleteOutlined />
        //         </Tooltip>
        //       </span>
        //     </Popconfirm>
        //   );

        const result: JSX.Element[] = [];
        controls.forEach((item, index) => {
          if (index) {
            result.push(<Divider key={`line${index}`} type="vertical" />);
          }
          result.push(item);
        });
        return result;
      },
    },
  ];

  // table列表所需数据
  const tableData = useMemo(() => {

    return data.map((item, index) => {
      console.log('item的数据', item);

      return {
        key: index,
        name: item.name,  // 姓名
        EmployeeID: item.EmployeeID,  // id
        // serial: index + 1 + (page.pageNum - 1) * page.pageSize,
        EmployeeName: item.EmployeeName,  // 用户名
        Password: item.Password,  // 密码
        Phone: item.Phone,  // 电话
        email: item.email,  // 邮箱
        conditions: item.conditions,  // 状态
        control: item.conditions,
        Position: item.Position,  // 职位
        IDCard: item.IDCard,  // 身份证
        Hiredate: item.HireDate,  // 出生日期
        desc: item.Note,  // 描述
        address: item.Address,  // 地址
        RoleID: item.RoleID,
        RoleName: item.RoleName,
        descs: item.desc,
        keys: item.keys
      }
    });
  }, [page, data]);

  return (
    <div>
      <div className="g-search">
        <ul className="search-func">
          <li>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              disabled={!p.includes("user:add")}
              onClick={() => onModalShow(null, "add")}
            >
              添加用户
            </Button>
          </li>
        </ul>
        <Divider type="vertical" />
        {p.includes("user:query") && (
          <ul className="search-ul">
            <li>
              <Input
                placeholder="请输入用户名"
                onChange={searchUsernameChange}
                value={searchInfo.username}
              />
            </li>
            <li>
              <Select
                placeholder="请选择状态"
                allowClear
                style={{ width: "200px" }}
                onChange={searchConditionsChange}
                value={searchInfo.conditions}
              >
                <Option value={1}>在职</Option>
                <Option value={-1}>离职</Option>
              </Select>
            </li>
            <li>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={onSearch}
              >
                搜索
              </Button>
            </li>
          </ul>
        )}
      </div>
      <div className="diy-table">
        <Table
          columns={tableColumns}
          loading={loading}
          dataSource={tableData}
          pagination={{
            total: page.total,
            current: page.pageNum,
            pageSize: page.pageSize,
            showTotal: (t) => `共 ${t} 条数据`,
            onChange: onTablePageChange,
          }}
        />
      </div>

      {/* 新增&修改&查看 模态框 */}
      <Modal
        title={{ add: "新增", up: "修改", see: "查看" }[modal.operateType]}
        visible={modal.modalShow}
        onOk={onOk}
        onCancel={onClose}
        confirmLoading={modal.modalLoading}
      >
        <Form
          form={form}
          initialValues={{
            conditions: 1,
          }}
        >
          <Form.Item
            label="姓名"
            name="name"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { max: 12, message: "最多输入12位字符" },
            ]}
          >
            <Input
              placeholder="请输入用户名"
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="用户名"
            name="EmployeeName"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { max: 12, message: "最多输入12位字符" },
            ]}
          >
            <Input
              placeholder="请输入用户名"
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          {modal.operateType === "add" && <Form.Item
            label="性别"
            name="sex"
            {...formItemLayout}
            rules={[
              { validator: validateGender },
            ]}
          >
            <Input
              placeholder="请输入性别"
            />
          </Form.Item>}
          <Form.Item
            label="密码"
            name="password"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { min: 6, message: "最少输入6位字符" },
              { max: 18, message: "最多输入18位字符" },
            ]}
          >
            <Input.Password
              placeholder="请输入密码"
              visibilityToggle={false}
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="电话"
            name="phone"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              () => ({
                validator: (rule, value) => {
                  const v = value;
                  if (v) {
                    if (!tools.checkPhone(v)) {
                      return Promise.reject("请输入有效的手机号码");
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              placeholder="请输入手机号"
              maxLength={11}
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          {modal.operateType === "add" && <Form.Item
            label="身份证"
            name="IDCard"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { max: 18 },
              () => ({
                validator: (rule, value) => {
                  const v = value;
                  if (v) {
                    if (!tools.checkIDCard(v)) {
                      return Promise.reject("请输入有效的身份证号码");
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              placeholder="请输入身份证号码"
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          }
          <Form.Item
            label="地址"
            name="address"
            {...formItemLayout}
          >
            <Input
              placeholder="请添加居住地址"
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            {...formItemLayout}
            rules={[
              () => ({
                validator: (rule, value) => {
                  const v = value;
                  if (v) {
                    if (!tools.checkEmail(v)) {
                      return Promise.reject("请输入有效的邮箱地址");
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              placeholder="请输入邮箱地址"
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="描述"
            name="desc"
            {...formItemLayout}
            rules={[{ max: 100, message: "最多输入100个字符" }]}
          >
            <TextArea
              rows={4}
              disabled={modal.operateType === "see"}
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item
            label="状态"
            name="conditions"
            {...formItemLayout}
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Select disabled={modal.operateType === "see"}>
              <Option key={1} value={1}>
                在职
              </Option>
              <Option key={-1} value={-1}>
                离职
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <RoleTree
        title={"分配角色"}
        data={role.roleData}
        visible={role.roleTreeShow}
        // defaultKeys={modal.nowData}
        loading={role.roleTreeLoading}
        onOk={onRoleOk}
        onClose={onRoleClose}
      />
    </div>
  );
}

export default UserAdminContainer;
