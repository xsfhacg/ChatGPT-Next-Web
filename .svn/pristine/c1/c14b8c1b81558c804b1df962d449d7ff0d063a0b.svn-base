import React, { use, useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Chip,
  Paper,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import CloseIcon from "../icons/close.svg";
import { IconButton } from "./button";
import axios from "axios";
import QRCodeDialog from "./payment";
import { CircularProgress } from "@mui/material";
import Wechat from "./wechat";
import Alipay from "./alipay";
import Divider from "@mui/material/Divider";
import PaymentIcon from "@mui/icons-material/Payment";
import { isWebApp } from "./iswapapp";
import ControlledAccordions from "./aboutus";
import { isUserLogin } from "../api/restapi/authuser";
// import MySnackbar from "./mysnackbar";
import mixpanel from "mixpanel-browser";
import Banner3 from "./banner3";
// import CountDown from "./countdown";
import AlertDialog from "./popup";
// import { Padding } from "@mui/icons-material";

import { Product, GetProductData } from "../api/restapi/restapi";
import { useAppConfig, useProfileStore } from "../store";
import { getTime } from "../utils";

mixpanel.init("6c4c1c926708fd247571a67ed0a25d6f", { debug: true });

const theme = createTheme({
  palette: {
    primary: {
      main: "#24292f",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
  typography: {
    fontFamily: "PingFang SC",
    fontSize: 12,
    fontWeightRegular: 600,
    fontWeightBold: 600,
  },
});

// 从JSON数组中获取会员订阅信息
const pricingOptions2 = [
  {
    title: "周会员",
    price: 14.9,
    description: "¥2/天.",
    buttonColor: "primary",
    buttonText: "加入会员",
    id: 99,
    lenth: "周",
    regularprice: "24.9",
  },
  {
    title: "月度会员",
    price: 29.8,
    description: "¥2/天.",
    buttonColor: "secondary",
    buttonText: "加入会员",
    id: 319,
    lenth: "月",
    regularprice: "38.9",
  },
  {
    title: "季度会员",
    price: 59.8,
    description: "¥2/天.",
    buttonColor: "primary",
    buttonText: "加入会员",
    id: 320,
    lenth: "三个月",
    regularprice: "79.9",
  },
  {
    title: "永久会员",
    price: 199,
    description: "¥2/天.",
    buttonColor: "primary",
    buttonText: "加入会员",
    id: 321,
    lenth: "-",
    regularprice: "299.9",
  },
];

export function Pricing() {
  const profileStore = useProfileStore();
  const [ismoble, setismobile] = useState(false);
  const [isphone, setisphone] = useState(false);
  const [pricingOptions, setPricingOptions] = useState<Product[]>([]);

  // 组件加载时获取商品列表
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userFid = profileStore.user_id;
        const productId = 473;
        const products = await GetProductData(userFid, productId);
        console.log("商品列表：", products);
        setPricingOptions(products);
      } catch (error) {
        console.error("获取商品列表失败:", error);
        setPricingOptions([]); // 获取商品列表出错时，将 pricingOptions 设置为空数组
      }
    };

    fetchData();
  }, [profileStore.user_id]);

  // 组件加载时判断设备类型和登录状态
  useEffect(() => {
    const isPhone = /Mobile|(Android|iPhone).+Mobile/.test(
      window.navigator.userAgent,
    );
    if (isPhone) {
      setisphone(true);
    }
    const isMobileDevice =
      /Mobile|(Android|iPhone).+Mobile/.test(window.navigator.userAgent) &&
      !/MicroMessenger/.test(window.navigator.userAgent);
    if (isMobileDevice) {
      setismobile(true);
      setSelectedPaymentMethod("alipay_scan_qrcode");
    }
    const res = isUserLogin();
    console.log("登录状态: ", res);
    if (!res) {
      window.location.href = "/#/login-register";
    }
  }, []);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // 扫码对话框显示状态
  const [imageURL, setImageURL] = useState(""); // 付款二维码地址链接
  const [loading, setLoading] = useState(false); //加载状态

  const handleClose = () => {
    setOpen(false);
  };
  const [SelectedPaymentMethod, setSelectedPaymentMethod] =
    useState("wxpay_scan_qrcode");
  const [transpayment, setTranspayment] = useState("微信");
  const [selectedPricingOption, setSelectedPricingOption] = useState(1);
  const appid = localStorage.getItem("appid");
  const user_id = localStorage.getItem("user_fid");
  const [order_id, setOrder_id] = useState(
    localStorage.getItem("current_order_id"),
  );
  const [bill_id, setBill_id] = useState(
    localStorage.getItem("current_bill_id"),
  );
  const [bill_title, setBill_title] = useState("");
  const [bill_price, setBill_price] = useState(0);

  if (pricingOptions.length === 0) {
    console.log("商品未获取，退出");
    return null; // 或者返回一个加载中的状态
  }

  // 创建订单
  const handleSubmit = async () => {
    setLoading(true);
    // const userAgent = isWebApp();
    // console.log("userAgent: ", userAgent);

    const shopFid = pricingOptions[selectedPricingOption].shopFid;
    const shopGoodsFid = pricingOptions[selectedPricingOption].shopGoodsFid;
    const shopGoodsSpecFid = pricingOptions[selectedPricingOption].id;
    // console.log(shopFid, shopGoodsFid, shopGoodsSpecFid);

    setBill_title(pricingOptions[selectedPricingOption].title);
    setBill_price(pricingOptions[selectedPricingOption].price);

    // const productId = pricingOptions[selectedPricingOption].id;
    // const productTitle = pricingOptions[selectedPricingOption].title;
    // const productPrice = pricingOptions[selectedPricingOption].price;
    // console.log(productId, productTitle, productPrice);
    // mixpanel.track("去支付", {
    //   用户名: user_id,
    //   支付方式: selectedPricingOption,
    //   套餐选项: productTitle,
    //   套餐价格: productPrice,
    // });
    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_TOKEN}`,
    //   },
    // };
    // const data = {
    //   payment_method: SelectedPaymentMethod,
    //   payment_method_title: SelectedPaymentMethod,
    //   set_paid: false,
    //   customer_id: user_id,
    //   billing: {},
    //   shipping: {},
    //   line_items: [
    //     {
    //       product_id: productId,
    //       quantity: 1,
    //     },
    //   ],
    //   shipping_lines: [
    //     {
    //       method_id: "flat_rate",
    //       method_title: "Flat Rate",
    //       total: "0",
    //     },
    //   ],
    // };

    const goodsListJson = [
      {
        shop_fid: shopFid,
        shop_goods_fid: shopGoodsFid,
        shop_goods_spec_fid: shopGoodsSpecFid,
        shop_goods_attrs: "",
        number: 1,
        orderno: 0,
      },
    ];

    // const localorderdata = localStorage.getItem(
    //   "orderdata_" + productId + "_" + SelectedPaymentMethod,
    // );
    // const currentTime = new Date();
    // const currentTimestmp = currentTime.getTime();
    // const getexptime = localorderdata ? JSON.parse(localorderdata).exptime : 0;
    // if (localorderdata && currentTimestmp < getexptime) {
    //   setLoading(false);
    //   if (userAgent) {
    //     window.location.href = JSON.parse(localorderdata).url;
    //     return;
    //   } else {
    //     setImageURL(JSON.parse(localorderdata).urlQrcode);
    //     setOpen(true);
    //     return;
    //   }
    // } else {
    try {
      const response = await axios.get(
        `http://www.orangeui.cn:10030/shopcenter/take_order`,
        {
          params: {
            appid: appid,
            user_fid: user_id,
            key: 123456,
            deliver_type: "express",
            recv_longitude: 0,
            recv_latitude: 0,
            recv_sex: 0,
            is_book: 0,
            tableware_quantity: 0,
            is_used_score: 0,
            used_score: 0,
            is_only_pay_delivery_fee: 0,
            want_arrive_time: getTime(),
            shop_fid: shopFid,
            shop_goods_list_json: JSON.stringify(goodsListJson),
          },
        },
      );
      // console.log(response.data);
      if (response.data.Code === 200) {
        const orderId = response.data.Data.OrderInfo[0].fid;
        const sumMoney = response.data.Data.OrderInfo[0].sum_money;
        setOrder_id(orderId);
        localStorage.setItem("current_order_id", orderId);
        if (orderId) {
          try {
            const getpaymentimg = await axios.get(
              `http://www.orangeui.cn:10030/paycenter/prepare_pay_order`,
              {
                params: {
                  appid: appid,
                  user_fid: user_id,
                  order_fid: orderId,
                  money: sumMoney,
                  order_type: "shop_center",
                  bill_code: "",
                  pay_type: SelectedPaymentMethod,
                  name: "订单支付",
                  desc: "感谢购买",
                },
              },
            );
            // console.log(getpaymentimg.data);

            if (getpaymentimg.data.Code === 200) {
              const billId = getpaymentimg.data.Data.UserBillMoney[0].fid;
              setBill_id(billId);
              const qrcode =
                SelectedPaymentMethod === "alipay_scan_qrcode"
                  ? getpaymentimg.data.Data.AliPayBack
                  : getpaymentimg.data.Data.WxPayBack;
              // console.log(qrcode);

              // if (userAgent) {
              //   const ordertime = new Date();
              //   const exptime = new Date(ordertime.getTime() + 15 * 60 * 1000);
              //   const ordertimestamp = ordertime.getTime();
              //   const exptimestamp = exptime.getTime();
              //   let orderdata = {
              //     urlQrcode: qrcode.url_qrcode,
              //     url: qrcode.url,
              //     productId: productId,
              //     ordertime: ordertimestamp,
              //     exptime: exptimestamp,
              //     payment: SelectedPaymentMethod,
              //   };
              //   localStorage.setItem(
              //     "orderdata_" + productId + "_" + SelectedPaymentMethod,
              //     JSON.stringify(orderdata),
              //   );
              //   window.location.href = qrcode.url;
              //   return;
              // }
              setImageURL(qrcode.QRCodePayUrl);
              setOpen(true);
              // const ordertime = new Date();
              // const exptime = new Date(ordertime.getTime() + 15 * 60 * 1000);
              // const ordertimestamp = ordertime.getTime();
              // const exptimestamp = exptime.getTime();

              // let orderdata = {
              //   urlQrcode: qrcode.QRCodePayUrl,
              //   url: qrcode.url,
              //   productId: productId,
              //   ordertime: ordertimestamp,
              //   exptime: exptimestamp,
              //   payment: SelectedPaymentMethod,
              // };
              // localStorage.setItem(
              //   "orderdata_" + productId + "_" + SelectedPaymentMethod,
              //   JSON.stringify(orderdata),
              // );
            } else {
              alert(getpaymentimg.data.Desc);
            }
          } catch (error) {
            console.error(error);
          }
          setLoading(false);
        }
      } else {
        alert(response.data.Desc);
      }
    } catch (error) {
      console.error(error);
    }
    // }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="window-header">
        <div className="window-header-title">
          <div className="window-header-main-title">购买套餐</div>
          <div className="window-header-sub-title">立刻开始Chat吧</div>
        </div>
        <div className="window-actions">
          <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
            />
          </div>
        </div>
      </div>

      <Container maxWidth="lg" sx={{ mt: 2, overflow: "auto" }}>
        <Banner3 />
        <Typography variant="h6" align="left" sx={{ mb: 3, mt: 1 }}>
          选择套餐
          <Typography
            component="span"
            variant="h6"
            sx={{ fontSize: "0.8rem", color: "gray" }}
          >
            （已有1000+用户开通）
          </Typography>
        </Typography>
        <Grid
          container
          spacing={1}
          alignItems="left"
          justifyContent="left"
          sx={{ mb: 3 }}
        >
          {pricingOptions.map((option, index) => {
            const key = `pricingOption_${index}`;
            return (
              <Grid item xs={6} sm={3} md={3} lg={3} key={key}>
                <Card
                  sx={{
                    boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.4)",
                    borderRadius: "5px",
                    cursor: "pointer",
                    position: "relative",
                    border:
                      selectedPricingOption === index
                        ? "2px solid var(--primary)"
                        : "",
                  }}
                  onClick={() => setSelectedPricingOption(index)}
                >
                  <CardContent
                    sx={{
                      color: selectedPricingOption === index ? "#f48fb1" : "",
                    }}
                  >
                    {index === 1 && (
                      <Chip
                        label="推荐"
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          backgroundColor: "red",
                          color: "white",
                          borderRadius: "0 0 0 10px", // Add this line to create a tag-like shape
                          borderTopLeftRadius: 0, // Add this line to create a tag-like shape
                          padding: "1px 1px", // Adjust padding for a more tag-like appearance
                          fontSize: "0.8rem", // Adjust font size if needed
                        }}
                      />
                    )}
                    <Typography
                      variant="subtitle2"
                      align="center"
                      sx={{ mb: 1 }}
                    >
                      {option.title}
                    </Typography>
                    <Typography variant="h6" align="center" sx={{ mb: 0 }}>
                      {option.price ? `¥${option.price}` : `Contact`}
                      <span>/{option.lenth}</span>
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      align="center"
                      sx={{
                        mb: 0,
                        textDecoration: "line-through",
                        color: "gray",
                      }}
                    >
                      {option.price ? `¥${option.regularprice}` : `Contact`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        <Divider sx={{ mb: 3 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" align="left">
            选择支付方式
          </Typography>
          {ismoble && <AlertDialog />}
        </Box>
        <Grid
          container
          spacing={1}
          alignItems="left"
          justifyContent="left"
          sx={{ mb: 3 }}
        >
          <Grid item xs={6} sm={3} md={3} lg={3}>
            <Card
              sx={{
                boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.4)",
                borderRadius: "5px",
                cursor: "pointer",
                border:
                  SelectedPaymentMethod === "wxpay_scan_qrcode"
                    ? "2px solid var(--primary)"
                    : "",
              }}
              onClick={() => {
                setSelectedPaymentMethod("wxpay_scan_qrcode");
                setTranspayment("微信");
              }}
            >
              <CardContent
                sx={{
                  // backgroundColor: SelectedPaymentMethod === "wechat" ? "#f48fb1" : "",
                  // color: SelectedPaymentMethod === "wechat" ? "#fff" : "",
                  paddingBottom: "16px !important",
                }}
              >
                <Grid
                  container
                  alignItems="center"
                  spacing={0}
                  sx={{ padding: 0 }}
                  justifyContent="center"
                >
                  <Grid item sx={{ mr: 2 }}>
                    <Wechat />
                  </Grid>
                  <Typography variant="h6" align="center" sx={{ mb: 0 }}>
                    微信
                  </Typography>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3} md={3} lg={3}>
            <Card
              sx={{
                boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.4)",
                borderRadius: "5px",
                cursor: "pointer",
                border:
                  SelectedPaymentMethod === "alipay_scan_qrcode"
                    ? "2px solid var(--primary)"
                    : "",
              }}
              onClick={() => {
                setSelectedPaymentMethod("alipay_scan_qrcode");
                setTranspayment("支付宝");
              }}
            >
              <CardContent
                sx={{
                  // backgroundColor: SelectedPaymentMethod === "alipay" ? "#f48fb1" : "",
                  // color: SelectedPaymentMethod === "alipay" ? "#fff" : "",
                  paddingBottom: "16px !important",
                }}
              >
                <Grid
                  container
                  alignItems="center"
                  spacing={0}
                  sx={{ padding: 0 }}
                  justifyContent="center"
                >
                  <Grid item sx={{ mr: 2 }}>
                    <Alipay />
                  </Grid>
                  <Typography variant="h6" align="center" sx={{ mb: 0 }}>
                    支付宝
                  </Typography>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {!ismoble && (
          <Grid item xs={6} sx={{ mb: 3 }}>
            <Grid container justifyContent="right">
              <Grid container justifyContent="right">
                <Typography variant="h6" align="right" sx={{ mb: 1, mt: 1 }}>
                  订单合计：{pricingOptions[selectedPricingOption].price}元
                </Typography>
              </Grid>
              <Grid container justifyContent="right">
                <Typography
                  variant="inherit"
                  align="right"
                  sx={{ mb: 1, mt: 0 }}
                >
                  当前选择：{pricingOptions[selectedPricingOption].title}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  size="large"
                  color="primary"
                  variant="contained"
                  startIcon={<PaymentIcon />}
                  onClick={handleSubmit}
                >
                  去支付
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
        {isphone && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper
              sx={{ position: "fixed", bottom: 0, width: "100%", zIndex: 9999 }}
            >
              <Box p={2}>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item xs={8}>
                    <Typography
                      variant="subtitle1"
                      align="right"
                      sx={{ mb: 0 }}
                    >
                      订单合计：
                      {pricingOptions[selectedPricingOption].price}元
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      align="right"
                      sx={{ mb: 0 }}
                    >
                      当前选择：
                      {pricingOptions[selectedPricingOption].title}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      size="large"
                      color="primary"
                      variant="contained"
                      startIcon={<PaymentIcon />}
                      onClick={handleSubmit}
                    >
                      去支付
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </div>
        )}
        <Divider sx={{ mb: 3 }} />

        {loading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 9999,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress color="success" />
            {/* <Typography variant="h5" sx={{ mb: 2 }}>
                            二维码生成中，请稍等...
                        </Typography> */}
          </Box>
        )}

        {/* 扫码对话框 */}
        <QRCodeDialog
          open={open}
          handleClose={handleClose}
          imageURL={imageURL}
          paymentId={transpayment}
          appid={appid}
          userId={user_id}
          billId={bill_id}
          title={bill_title}
          money={bill_price}
        />
        <Typography
          variant="h6"
          align="left"
          sx={{
            mb: 3,
            mt: 3,
            // "@media (max-width: 600px)": {
            //   maxHeight: "50vh",
            //   overflowY: "scroll",
            // },
          }}
        >
          为什么选择我们？
        </Typography>
        <ControlledAccordions />
      </Container>
    </ThemeProvider>
  );
}

// export default Pricing;
