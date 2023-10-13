import axios from "axios";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  buttonColor: string;
  buttonText: string;
  lenth: string;
  regularprice: number;
  appid: number;
  shopFid: number;
  shopGoodsFid: number;
  // shopGoodsSpecFid: number;
}

// 获取会员套餐
export async function GetProductData(
  userFid: string,
  productId: number,
): Promise<Product[]> {
  try {
    const response = await axios.get(
      `/save_api/shopcenter/get_goods_info?appid=1000&user_fid=${userFid}&key=&shop_goods_fid=${productId}`,
    );
    const pricingOptions = response.data.Data.Goods[0].GoodsSpec.map(
      (product: {
        appid: any;
        fid: any;
        name: any;
        price: number;
        service_days: number;
        display_origin_price: any;
      }) => ({
        id: product.fid,
        title: product.name,
        price: product.price,
        description: `¥${(product.price / product.service_days).toFixed(2)}/天`,
        buttonColor: "primary",
        buttonText: "加入会员",
        lenth: `${product.service_days}天`,
        regularprice: product.display_origin_price,
        appid: product.appid,
        shopFid: 85,
        shopGoodsFid: 473,
      }),
    );
    // return response.data.Data.Goods[0].GoodsSpec as Product[];
    return pricingOptions as Product[];
  } catch (error) {
    console.error("Error fetching product data:", error);
    return [];
  }
}

// 判断当前用户是否为会员
export async function getMenberInfo() {
  const userid = localStorage.getItem("user_info");
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/membership_info/v1/user?user_id=${userid}`,
  );
  return response.data;
}

// 获取当前用户信息
export async function getUserInfo() {
  const token = localStorage.getItem("login_key");
  try {
    const response = await axios.get(
      `/save_api/usercenter/get_user_info?key=${token}`,
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// 发送邀请码
export async function sendInviteCode(invite_code: string) {
  const user_id = localStorage.getItem("user_info");
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/invite/v1/check?user_id=${user_id}&invite_code=${invite_code}`,
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// 刷新套餐次数
export async function refreshChatCount() {
  const login_key = localStorage.getItem("login_key");
  try {
    const response = await axios.get(
      `/save_api/usercenter/sync_user_chatgpt_use_status?key=${login_key}`,
    );
    console.log(response.data);
    // return response.data;
  } catch (error) {
    console.error(error);
  }
}
