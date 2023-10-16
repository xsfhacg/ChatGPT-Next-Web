import axios from "axios";

// 获取支付状态
async function getOrderStatus(appid: number, user_fid: string, billId: number) {
  const response = await axios.get(`/save_api/paycenter/get_bill_money_info`, {
    params: {
      appid: appid,
      user_fid: user_fid,
      money_fid: billId, //支付订单fid
    },
  });
  // localStorage.setItem("order_status", response.data.id);
  console.log(response.data.Data.pay_state);
  const order_status = response.data.Data.pay_state;
  return order_status;
}
export default getOrderStatus;
