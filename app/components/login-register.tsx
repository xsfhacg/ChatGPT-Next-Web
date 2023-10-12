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
  console.log(url);

  useEffect(() => {
    const res = isUserLogin();
    console.log("当前登陆状态：", res);
    if (res) {
      // setOpen(true);
      setMessage("您已登录，无需重复登录");
      setSeverity("warning");
      navigate(Path.Profile);
    }
  }, [navigate]);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  }, [url]);

  // useEffect(() => {
  //   const keydownEvent = (e: KeyboardEvent) => {
  //     if (e.key === "Escape") {
  //       navigate(Path.Home);
  //     }
  //   };
  //   document.addEventListener("keydown", keydownEvent);
  //   return () => {
  //     document.removeEventListener("keydown", keydownEvent);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    // const loggedIn = document.cookie.includes("loggedIn=true");
    const loggedIn = getCookie("loggedIn") || false;
    console.log(loggedIn);

    if (loggedIn) {
      // 登录成功
      console.log("登录成功");
    } else {
      console.log("未登录");
    }
  }, []);

  useEffect(() => {
    // 定时器 ID
    let intervalId: NodeJS.Timeout;

    const checkLoginCookie = () => {
      console.log("开始轮询登录cookie");
      // const loggedIn = document.cookie.includes("loggedIn=true");
      const appId = getCookie("appid") || "1000";
      const loggedIn = getCookie("loggedIn") || false;
      const loginKey = getCookie("login_key") || "";
      const userFid = getCookie("user_fid") || "";
      const userName = getCookie("user_name") || "未登录";
      const userEmail = getCookie("user_email") || "未设置";

      if (loggedIn) {
        // 登录成功
        console.log("登录成功");
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("appid", appId);
        localStorage.setItem("login_key", loginKey);
        localStorage.setItem("user_fid", userFid);
        localStorage.setItem("user_name", userName);
        localStorage.setItem("user_email", userEmail);
        window.dispatchEvent(new Event("customEvent"));
        navigate(Path.Profile);
        if (intervalId) {
          clearInterval(intervalId); // 取消轮询
        }
      }
    };

    // 页面加载时立即执行一次
    checkLoginCookie();

    // 定时执行检查登录cookie的逻辑
    const startPolling = () => {
      intervalId = setInterval(checkLoginCookie, 1000); // 每隔 1 秒执行一次
    };
    // 启动定时轮询
    startPolling();

    // 在组件卸载时清除定时器
    return () => {
      console.log("取消登录cookie轮询");
      clearInterval(intervalId);
    };
  }, [navigate]);

  return (
    <ErrorBoundary>
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">
            {Locale.LoginRegister.Title}
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
