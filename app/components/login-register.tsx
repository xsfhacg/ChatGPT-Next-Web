import React, { useEffect, useState, useRef } from "react";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { useNavigate } from "react-router-dom";
import { IconButton } from "./button";
import CloseIcon from "../icons/close.svg";
import Locale from "../locales";
import { getUserInfo, isUserLogin } from "../api/restapi/authuser";

export function LoginRegister({ url }: { url: string }): JSX.Element {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const operateType = localStorage.getItem("operate_type") || "login";
  const userFid = localStorage.getItem("user_fid");
  const loginKey = localStorage.getItem("login_key");

  // 检测当前操作类型是否为单独的绑定手机号
  useEffect(() => {
    const updatedUrl =
      operateType === "login"
        ? url
        : `${url}&operate_type=${operateType}&user_fid=${userFid}&login_key=${loginKey}`;
    console.log("login-url: ", updatedUrl);

    if (iframeRef.current) {
      iframeRef.current.src = updatedUrl;
    }
  }, [loginKey, operateType, url, userFid]);

  // ESC按键检测
  useEffect(() => {
    const keydownEvent = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(Path.Home);
      }
    };
    document.addEventListener("keydown", keydownEvent);
    return () => {
      document.removeEventListener("keydown", keydownEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   const loginState = isUserLogin();
  //   console.log("当前登陆状态：", loginState);
  //   if (loginState) {
  //     setMessage("您已登录，无需重复登录");
  //     setSeverity("warning");
  //     navigate(Path.Profile);
  //     return;
  //   }
  // }, [navigate]);

  useEffect(() => {
    // 定时器 ID
    let intervalId: NodeJS.Timeout;

    // 检查登录信息
    const checkLoginCookie = () => {
      console.log("轮询登录cookie");
      const loggedIn = document.cookie.includes("loggedIn=true");
      // console.log('loggedIn: ', loggedIn, typeof(loggedIn));

      // 登录成功
      if (loggedIn) {
        console.log("登录成功");

        const appId = getCookie("appid") || "1000";
        const userFid = getCookie("user_fid") || "";
        const loginKey = getCookie("login_key") || "";
        const userName = getCookie("user_name") || "获取异常";
        const userPhone = getCookie("user_phone") || "未设置";
        const userEmail = getCookie("user_email") || "未设置";

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("appid", appId);
        localStorage.setItem("user_fid", userFid);
        localStorage.setItem("login_key", loginKey);
        localStorage.setItem("user_name", userName);
        localStorage.setItem("user_phone", userPhone);
        localStorage.setItem("user_email", userEmail);
        window.dispatchEvent(new Event("customEvent"));

        if (intervalId) {
          clearInterval(intervalId); // 取消轮询
        }
        navigate(Path.Profile);
      }
    };

    // 检查绑定手机号
    const checkBindPhoneCookie = () => {
      console.log("轮询绑定手机号cookie");
      const bindPhone = getCookie("user_phone") || "";
      // console.log('bindPhone: ', bindPhone);

      if (bindPhone.length == 11) {
        console.log("绑定成功");
        localStorage.setItem("user_phone", bindPhone);

        if (intervalId) {
          clearInterval(intervalId); // 取消轮询
        }
        navigate(Path.Profile);
      }
    };

    // 如果是登录页面加载时立即执行一次
    if (operateType === "login") {
      checkLoginCookie();
    }

    // 定时执行检查cookie的逻辑
    const startPolling = () => {
      console.log("启动定时轮询");
      // intervalId = setInterval(checkLoginCookie, 1000); // 每隔 1 秒执行一次
      intervalId = setInterval(() => {
        operateType === "login" ? checkLoginCookie() : checkBindPhoneCookie();
      }, 1000);
    };

    // 启动定时轮询
    startPolling();

    // 在组件卸载时清除定时器
    return () => {
      console.log("取消cookie轮询");
      clearInterval(intervalId);
    };
  }, [navigate, operateType]);

  return (
    <ErrorBoundary>
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">
            {/* {Locale.LoginRegister.Title} */}
            {localStorage.getItem("operate_type") === "bind_phone" ? (
              <span>{Locale.LoginRegister.BindTitle}</span>
            ) : (
              <span>{Locale.LoginRegister.Title}</span>
            )}
          </div>
          <div className="window-header-sub-title">
            {/* {Locale.LoginRegister.SubTitle} */}
          </div>
        </div>
        <div className="window-actions">
          <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
              title={Locale.LoginRegister.Actions.Close}
            />
          </div>
        </div>
      </div>
      <div style={{ height: "100%" }}>
        {/* <h1>登录&注册</h1> */}
        <iframe
          ref={iframeRef}
          title="External Content"
          width="100%"
          height="100%"
          frameBorder="0"
        />
      </div>
    </ErrorBoundary>
  );
}
