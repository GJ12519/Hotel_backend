import HYRequest from "./request";

const BASE_URL = "http://127.0.0.1:8088";
const TIME_OUT = 10000;

const hyRequest = new HYRequest({
    baseURL: BASE_URL,
    timeout: TIME_OUT,
});

export default hyRequest;