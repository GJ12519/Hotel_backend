/** User 系统管理/`客户`管理 **/

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

// ==================
// 所需的组件
// ==================
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
function GusAdminContainer(): JSX.Element {
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

    // 生命周期 - 组件挂载时触发一次
    useMount(() => {
        onGetData(page);
    });

    // 函数 - 查询当前页面所需列表数据
    async function onGetData(page: {
        pageNum: number;
        pageSize: number;
    }): Promise<void> {
        // console.log('第几条数据开始', page.pageNum, '获取数量', page.pageSize);


        const params = {
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            name: searchInfo.username,
            conditions: searchInfo.conditions,
        };
        setLoading(true);
        try {
            const res = await dispatch.guster.getguslist(tools.clearNull(params)) as any
            console.log('所有用户的信息', res?.data?.results);
            // const res11 = res?.data?.results?.result

            if (res && res.data.status === 200) {
                // console.log(res11, 111);

                setData(res.data.results.result);
                setPage({
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
        // console.log('page', page);

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
        // console.log('查看data数据', data);

        setModal({
            modalShow: true,
            nowData: data,
            operateType: type,
        });
        // console.log(modal);

        // 用setTimeout是因为首次让Modal出现时得等它挂载DOM，不然form对象还没来得及挂载到Form上
        setTimeout(() => {
            if (type === "add") {
                // 新增，需重置表单各控件的值
                form.resetFields();
            } else if (data) {
                // console.log(data);
                // 查看或修改，需设置表单各控件的值为当前所选中行的数据
                form.setFieldsValue({
                    ...data,
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
            // console.log('values', values, modal.operateType);

            setModal({
                modalLoading: true,
            });
            const params: UserBasicInfoParam = {
                name: values.name,
                Password: values.Password,
                Phone: values.Phone,
                email: values.email,
                IDCard: values.IDCard,
                note: values.note,
                sex: values.sex,
                conditions: values.conditions,
            };
            if (modal.operateType === "add") {
                // 新增
                try {
                    const res: Res | undefined = await dispatch.guster.addGus(params);
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
                // console.log('jhfdshj', params);
                // console.log(';', modal?.nowData);

                params.ID = modal.nowData?.ID;
                // console.log('sadreasdfasdfas', params, modal.nowData);

                try {
                    const res = await dispatch.guster.upGusmsg(params) as any;
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

    /** 模态框关闭 **/
    const onClose = () => {
        setModal({
            modalShow: false,
        });
    };

    // 表格页码改变
    const onTablePageChange = (pageNum: number, pageSize: number): void => {
        // console.log('yeeeee', pageNum, pageSize);
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
            dataIndex: "ID",
            key: "ID",
            align: 'center'
        },
        {
            title: "姓名",
            dataIndex: "name",
            key: "name",
            align: 'center'
        },
        {
            title: "性别",
            dataIndex: "sex",
            key: "sex",
            align: 'center'
        },
        {
            title: "身份证",
            dataIndex: "IDCard",
            key: "IDCard",
            align: 'center'
        },
        {
            title: "电话",
            dataIndex: "Phone",
            key: "Phone",
            align: 'center',
        },
        {
            title: "状态",
            dataIndex: "conditions",
            key: "conditions",
            render: (v: number): JSX.Element =>
                v === 1 ? (
                    <span style={{ color: "green" }}>启用</span>
                ) : (
                    <span style={{ color: "red" }}>禁用</span>
                ),
            align: 'center'
        },
        {
            title: "操作",
            key: "control",
            width: 200,
            align: 'center',
            render: (v: null, record: TableRecordData) => {
                const controls = [];
                const u = userinfo.userBasicInfo || { EmployeeID: -1 };
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

            return {
                key: index,
                name: item.Gus_name,
                ID: item.Gus_id,
                IDCard: item.IDCard,
                sex: item.Gender,
                // serial: index + 1 + (page.pageNum - 1) * page.pageSize,
                // EmployeeName: item.EmployeeName,
                Password: item.Gus_password,
                Phone: item.Phone,
                email: item.Email,
                conditions: item.conditions,
                control: item.conditions,
                note: item.note
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
                            // disabled={!p.includes("user:add")}
                            onClick={() => onModalShow(null, "add")}
                        >
                            添加用户
                        </Button>
                    </li>
                </ul>
                <Divider type="vertical" />
                {(
                    <ul className="search-ul">
                        <li>
                            <Input
                                placeholder="请输入姓名"
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
                                <Option value={1}>启用</Option>
                                <Option value={-1}>禁用</Option>
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
                        current: page.pageNum,  // 当前页码
                        pageSize: page.pageSize,   // 每页显示数量
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
                    disabled={true}
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
                    <Form.Item
                        label="密码"
                        name="Password"
                        {...formItemLayout}
                        rules={[
                            { required: false, whitespace: true, message: "必填" },
                            { min: 6, message: "最少输入6位字符" },

                            // { max: 18, message: "最多输入18位字符" },
                        ]}
                    >
                        <Input.Password
                            placeholder="初始密码123456"
                            disabled={true}
                        />
                    </Form.Item>
                    <Form.Item
                        label="性别"
                        name="sex"
                        {...formItemLayout}
                        rules={[
                            { max: 3, message: "最多输入3位字符" },
                        ]}
                    >
                        <Input
                            placeholder="请输入性别"
                            disabled={modal.operateType === "see"}
                        />
                    </Form.Item>
                    <Form.Item
                        label="电话"
                        name="Phone"
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
                        name="note"
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
                                启用
                            </Option>
                            <Option key={-1} value={-1}>
                                禁用
                            </Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default GusAdminContainer;
