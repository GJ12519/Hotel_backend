/* Footer 页面底部 */
import React, { FC, memo, useEffect, useState } from "react";
import "./index.less";
import PropTypes from 'prop-types'
import { Tooltip } from "antd";
import Icon_All from "@/util/icon";
import { RoomWrapper } from "./style";
import { useSetState, useMount } from "react-use";

interface Props {
    itemdata?: any;
    handleRoomClick?: any;
    index: number;
}

const RoomTable: FC<Props> = (props) => {
    const { itemdata, handleRoomClick, index } = props
    const [color, setColor] = useState('#baafafe4')

    useEffect(() => {
        const { isable } = itemdata
        // console.log('iijjiijj', isable);
        if (isable == 0) {
            setColor('#ebebeb')
        } else if (isable == 1) {
            setColor('#ddff00')
        } else if (isable == 2) {
            setColor('#71ff4a')
        } else {
            setColor('#ff1a1a')
        }
    }, [itemdata])

    // 事件
    const handleClick = (e: string, n: number) => {
        // console.log('hhh这是nnnnnnn', n);
        handleRoomClick(e, n)
    }

    return (
        <RoomWrapper color={color}>
            <div className="roomtitle">
                {itemdata.room_id}
            </div>
            <div className="hr"></div>
            <div className="btn">
                <Tooltip title="详情">
                    <Icon_All type="icon-xiangqing" className="btnicon" onClick={() => handleClick('Details', index)}></Icon_All>
                </Tooltip>
                <Tooltip title="预定">
                    <Icon_All type="icon-yuding" className="btnicon" onClick={() => handleClick('Reserve', index)}></Icon_All>
                </Tooltip>
                <Tooltip title="清洁">
                    <Icon_All type="icon-qingji" className="btnicon" onClick={() => handleClick('clean', index)}></Icon_All>
                </Tooltip>
                <Tooltip title="入住">
                    <Icon_All type="icon-ruzhu" className="btnicon" onClick={() => handleClick('Checkin', index)}></Icon_All>
                </Tooltip>
            </div>
        </RoomWrapper>
    );
}

RoomTable.propTypes = {
    itemdata: PropTypes.any
}

export default RoomTable
