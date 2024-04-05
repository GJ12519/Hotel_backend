/** User 系统管理/`客房`管理 **/

// ==================
// 所需的第三方库
// ==================
import React, { useState, useMemo } from "react";
import { useSetState, useMount } from "react-use";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
    Button,
    Input,
    message,
    Divider,
    Select,
    Modal,
    Form,
    DatePicker
} from "antd";
// ==================
// 所需的自定义的东西
// ==================
import tools from "@/util/tools"; // 工具函数
import "./index.less"

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker

const formItemLayout = {
    labelCol: {
        xs: { span: 23 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 23 },
        sm: { span: 15 },
    },
};

// ==================
// 类型声明
// ==================
import {
    RoomRecordData,
    ModalType,
    operateType,
    RoomUserData,
    ValuesType
} from "./index.type";
import { RootState, Dispatch } from "@/store";
import RoomTable from "@/components/Room";

function RoomAdminContainer(): JSX.Element {
    const dispatch = useDispatch<Dispatch>();
    const [Room, setRoom] = useState<RoomUserData[]>([]);      /* 客房以及租客的的信息 */
    const [RoomUser, setRoomUser] = useState<RoomUserData[]>([])         /* 租客 */
    const [form] = Form.useForm();
    const [num, setNum] = useState<number>(0)
    const [isable, setIsable] = useState<number>(0)


    const [modal, setModal] = useSetState<ModalType>({
        operateType: "Details", // Details详情，Checkin入住，clean清洁，Reserve预定
        nowData: null,
        modalShow: false,
        modalLoading: false,
    });

    // 生命周期 - 组件挂载时触发一次
    useMount(() => {
        getRoomMsg();
    });

    async function getRoomMsg() {
        try {
            // 获取客房信息
            const res = await dispatch.room.getroommsg();

            if (res && res.status === 200) {
                console.log('客房信息', res.results);
                await setRoom(res?.results);
            } else {
                message.error(res?.message ?? "数据获取失败");
            }
        } catch (error) {
            message.error('网络错误');
        }
    }

    // 事件处理
    const handleRoomClick = (e: string, n: number) => {
        setNum(n)

        switch (e) {
            case 'Details':
                setModal({
                    modalShow: true,
                    operateType: "Details"
                })
                message.info('正在完善中......')
                break;
            case 'Reserve':     // 预定
                // ReserveClick(n)
                if (Room[n].userID) {
                    console.log('执行了', Room[n]);
                    if (Room[n].isable === 2) {
                        message.info('已有客户入住,请换一间预定')
                    } else {
                        setTimeout(() => {
                            form.setFieldsValue({
                                name: Room[n].Gus_name,
                                IDCard: Room[n].IDCard,
                                phone: Room[n].Phone,
                                room: Room[n].room_id
                            });
                        });
                        setModal({
                            modalShow: true,
                            operateType: "Reserve"
                        })
                    }
                } else {
                    if (Room[n].isable === -1) {
                        message.info('客房故障,请换一间')
                    } else {
                        setModal({
                            modalShow: true,
                            operateType: "Reserve"
                        })
                    }
                    // 重置，需重置表单各控件的值
                    // form.resetFields();
                    form.setFieldsValue({
                        room: Room[n].room_id
                    });
                }
                break;
            case 'Checkin':     // 入住
                if (Room[n].userID) {
                    console.log('执行了', Room[n]);
                    setTimeout(() => {
                        form.setFieldsValue({
                            name: Room[n].Gus_name,
                            IDCard: Room[n].IDCard,
                            phone: Room[n].Phone,
                            room: Room[n].room_id
                        });
                    });
                    setModal({
                        modalShow: true,
                        operateType: "Checkin"
                    })
                } else {
                    if (Room[n].isable === -1) {
                        message.info('客房故障,请换一间')
                    } else {
                        setModal({
                            modalShow: true,
                            operateType: "Checkin"
                        })
                    }
                    // 新增，需重置表单各控件的值
                    // form.resetFields();
                    form.setFieldsValue({
                        room: Room[n].room_id
                    });
                }
                break;
            case 'clean':
                setModal({
                    modalShow: false,
                    operateType: "clean"
                })
                message.info('正在完善中......')
                break;
            default:
                message.error('出错!')
        }
    }


    // const DetailsClick = () => {
    //     console.log('details');
    // }

    // const ReserveClick = async (n: number) => {
    //     console.log('预定');

    // }

    // const CleanClick = () => {
    //     console.log('Clean');
    // }

    // const CheckinClick = () => {
    //     console.log('Checkin');
    // }

    // 模态框确认
    const onOK = async () => {
        // 获取values并对数据进行处理
        const values = await form.validateFields();
        console.log(values.btime);

        const Atime = {
            stime: moment(values.btime[0]._d).format('YYYY-MM-DD HH:mm:ss'),
            etime: moment(values.btime[1]._d).format('YYYY-MM-DD HH:mm:ss')
        }

        const { btime, ...rest } = values
        Object.assign(rest, { ...Atime })
        console.log('rest', rest);

        try {
            if (modal.operateType === "Details") {
                message.info('待完善')
            } else if (modal.operateType === "Reserve") {
                const ReserveRes = await dispatch.room.reserve(rest)
                console.log('reserve', ReserveRes);
            } else if (modal.operateType === "clean") {
                message.info('待完善')
            }
            else if (modal.operateType === "Checkin") {
                const CheckinRes = await dispatch.room.checkin(rest)
                console.log(CheckinRes);
            }
        } catch {
            message.error('网络错误，请重试...')
        }
        console.log('成功了，返回');
        getRoomMsg()
        onClose();
    }

    /** 模态框关闭 **/
    const onClose = () => {
        form.resetFields();

        setModal({
            modalShow: false,
        });

    };

    return (
        <div>
            <div className="block">
                <ul className="colorblock">
                    <li>
                        <div className="kong"></div>
                        <span>空房</span>
                    </li>
                    <li>
                        <div className="yellow"></div>
                        <span>预定</span>
                    </li>
                    <li>
                        <div className="green"></div>
                        <span>入住</span>
                    </li>
                    <li>
                        <div className="red"></div>
                        <span>故障</span>
                    </li>
                </ul>
            </div>
            <Divider style={{ margin: "12px 0" }} type="horizontal" />
            <div className="room">
                {
                    Room.map((item, index) => {
                        return <RoomTable handleRoomClick={handleRoomClick} key={item.room_id} itemdata={item} index={index} ></RoomTable>
                    })
                }
            </div>
            <Modal
                title={{ Details: "详情", Reserve: "预定", clean: "清洁", Checkin: "入住" }[modal.operateType]}
                visible={modal.modalShow}
                onCancel={onClose}
                onOk={onOK}
            >
                <Form
                    form={form}
                    initialValues={{
                        conditions: 1,
                    }}
                    disabled={true}
                >
                    <Form.Item
                        label="房间号"
                        name="room"
                        {...formItemLayout}
                        rules={[{ required: true }]}
                    >
                        <Input
                            placeholder="请输入房间号"
                            maxLength={10}
                            disabled={true}
                        />
                    </Form.Item>
                    {modal.operateType !== "Details" && (<Form.Item
                        label="姓名"
                        name="name"
                        {...formItemLayout}
                        rules={[
                            { required: true, whitespace: true, message: "必填" },
                            { max: 12, message: "最多输入12位字符" },
                        ]}
                    >
                        <Input
                            placeholder="请输入姓名"
                            disabled={false}
                        />
                    </Form.Item>)}
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
                            disabled={modal.operateType === "Details"}
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
                            disabled={modal.operateType === "Details"}
                        />
                    </Form.Item>
                    <Form.Item
                        label={modal.operateType === "Reserve" ? '预定日期' : '居住日期'}
                        name="btime"
                        {...formItemLayout}
                        rules={[{ required: true, message: "请选择状态" }]}
                    >
                        <RangePicker
                            disabled={false}
                        // value={Room[num].}
                        />
                    </Form.Item>
                    {modal.operateType !== "Details" && (<Form.Item
                        label="状态"
                        name="conditions"
                        {...formItemLayout}
                        rules={[{ required: true, message: "请选择状态" }]}
                    >
                        <Select disabled={false}>
                            <Option key={1} value={1}>
                                {modal.operateType === "Reserve" ? "确认预定" : "确认入住"}
                                {/* 确认预定 */}
                            </Option>
                            <Option key={-1} value={-1}>
                                {modal.operateType === "Reserve" ? "取消预定" : "取消入住"}
                                {/* 取消预定 */}
                            </Option>
                        </Select>
                    </Form.Item>)}
                </Form>
            </Modal>
        </div>
    )
}

export default RoomAdminContainer;

