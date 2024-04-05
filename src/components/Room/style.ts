import styled from "styled-components";

export const RoomWrapper = styled.div`
    position: relative;
    box-sizing: content-box;
    width: 125px;
    height: 100px;
    margin: 5px 10px;
    padding: 0;
    /* opacity: 0.8; */
    background-color: ${props => props.color || '#baafafe'};
    border-radius: 8px;
    // border: 1px solid;

    .roomtitle {
        width: 130px;
        position: absolute;
        top: 0;
        margin-left: -10%;
        left: 50%;
    }

    // .hr {
    //     position: absolute;
    //     top: 20px;
    //     border-bottom: 1px solid rgba(220, 220, 220, 0.789);
    //     width: 100%;
    // }

    .btn {
        position: absolute;
        display: flex;
        overflow: hidden;
        flex-wrap: wrap;
        justify-content: center;
        top: 30px;

        .btnicon {
            width: 60px;
            height: 30px;
            line-height: 30px;
            // border: 1px solid;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            margin: 3px 1px;
            cursor: pointer;
        }
    }
`