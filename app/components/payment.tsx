import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/system";
import { Button, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";
import getOrderStatus from "../api/restapi/authorder";
import MySnackbar from "./mysnackbar";
import QRCode from "qrcode";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { refreshChatCount } from "../api/restapi/restapi";

const CustomDialogTitle = styled(DialogTitle)({
  backgroundColor: "#3f51b5",
  color: "white",
  textAlign: "center",
});

const CustomDialogContent = styled(DialogContent)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0 20px",
});

// 支付套餐信息
const CustomDialogFooter = styled(DialogContent)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0 0 20px 0",
  color: "red",
});

// 底部支付提示
const CustomDialogHint = styled(DialogContent)({
  margin: "1rem",
  border: "1px solid gold",
  backgroundColor: "#FFFBE6",
});

function QRCodeDialog(props: {
  open: any;
  handleClose: any;
  imageURL: any;
  paymentId: any;
  appid: any;
  userId: any;
  billId: any;
  title: any;
  money: any;
}) {
  const {
    open,
    handleClose,
    imageURL,
    paymentId,
    appid,
    userId,
    billId,
    title,
    money,
  } = props;
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success");
  const [isopen, setIsopen] = React.useState(false);
  const onhandleClose = () => {
    setIsopen(false);
  };
  const navigate = useNavigate();

  const [imgUrl, setImgUrl] = useState("");
  useEffect(() => {
    // const canvas = document.getElementById('canvas');
    // QRCode.toCanvas(canvas, imageURL);

    QRCode.toDataURL(
      imageURL,
      (error: Error | null | undefined, url: string) => {
        setImgUrl(url);
      },
    );
  }, [imageURL]);

  // 订单支付状态轮询
  useEffect(() => {
    // 定时器 ID
    let intervalId: NodeJS.Timeout;

    const checkPayState = async () => {
      const status = await getOrderStatus(appid, userId, billId);
      if (status === "payed") {
        setMessage("支付成功");
        setSeverity("success");
        setIsopen(true);
        await refreshChatCount();
        if (intervalId) {
          clearInterval(intervalId); // 取消轮询
        }
        setTimeout(() => {
          handleClose();
          navigate(Path.Profile);
        }, 1000);
      }
    };

    // 定时执行
    const startPolling = () => {
      intervalId = setInterval(checkPayState, 3000); // 每隔 3 秒执行一次
    };
    // 启动定时轮询
    if (open) {
      startPolling();
      // 超过1分钟未支付取消轮询
      setTimeout(function () {
        if (intervalId) {
          clearInterval(intervalId);
        }
      }, 60000);
    }

    // 在组件卸载时清除定时器
    return () => {
      if (intervalId) {
        console.log("取消订单支付状态轮询");
        clearInterval(intervalId);
        onhandleClose();
      }
    };
  }, [open, appid, billId, handleClose, userId, navigate]);

  async function handleClick() {
    setLoading(true);
    const status = await getOrderStatus(appid, userId, billId);
    if (status === "payed") {
      setMessage("支付成功");
      setSeverity("success");
      setIsopen(true);
      await refreshChatCount();
      setTimeout(() => {
        handleClose();
        navigate(Path.Profile);
      }, 1000);
    } else {
      setMessage(
        "暂未收到付款，请稍后重试，若遇到支付异常请联系客服QQ：452330643",
      );
      setSeverity("warning");
      setIsopen(true);
    }
    console.log(status);
    setLoading(false);
  }

  return (
    <div>
      <Dialog open={open}>
        <CustomDialogTitle sx={{ mb: 2 }}>
          使用{paymentId}扫描下方二维码支付
        </CustomDialogTitle>
        <CustomDialogContent sx={{}}>
          {imgUrl ? (
            <img src={imgUrl} alt="支付二维码" />
          ) : (
            <div>正在生成支付二维码...</div>
          )}
        </CustomDialogContent>
        <CustomDialogFooter sx={{}}>
          <span>
            {title} : {money}元
          </span>
        </CustomDialogFooter>
        <Stack
          spacing={2}
          justifyContent="center"
          direction="row"
          sx={{ mb: 0 }}
        >
          <LoadingButton
            size="small"
            onClick={handleClick}
            loading={loading}
            loadingIndicator="。。"
            variant="outlined"
            sx={{
              "&:hover": {},
              color: "white",
              border: 0,
              padding: 0,
              fontSize: "14px",
              backgroundColor: "deepskyblue",
            }}
          >
            已支付
          </LoadingButton>
          <Button onClick={handleClose} variant="text">
            取消
          </Button>

          {/* 顶部悬浮提示 */}
          <MySnackbar
            open={isopen}
            handleClose={onhandleClose}
            severity={severity}
            message={message}
          />
        </Stack>
        <CustomDialogHint>一分钟内未支付成功请重新发起</CustomDialogHint>
      </Dialog>
    </div>
  );
}

export default QRCodeDialog;
