import React, { useEffect, useState } from "react";
import { Path } from "../constant";
import { IconButton } from "./button";
import VipIcon from "../icons/vip.svg";
import LoginIcon from "../icons/login.svg";
import UserIcon from "../icons/user.svg";
import styles from "./home.module.scss";
import { useNavigate } from "react-router-dom";
import { isUserLogin } from "../api/restapi/authuser";

interface BasicListProps {
  isLoggedIn: boolean;
  narrow: boolean;
}

export default function BasicList({ isLoggedIn, narrow }: BasicListProps) {
  const navigate = useNavigate();
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(localStorage.getItem("loggedIn") === "true");

  // useEffect(() => {
  //   const handleLoginStateChange = (event: StorageEvent) => {
  //     console.log('侧边栏开始监听登录状态');
  //     if (event.key === "loggedIn") {
  //       console.log('检测到 loggedIn 值发生改变：', event.newValue);
  //       setIsLoggedIn(event.newValue === "true");
  //     }
  //   };

  //   window.addEventListener("storage", handleLoginStateChange);

  //   return () => {
  //     window.removeEventListener("storage", handleLoginStateChange);
  //   };
  // }, []);

  return (
    <div>
      {!isLoggedIn && (
        <div className={styles["sidebar-header-bar"]}>
          <IconButton
            icon={<LoginIcon />}
            text={narrow ? undefined : "注册&登录"}
            className={styles["sidebar-bar-button"]}
            onClick={() => navigate(Path.LoginRegister)}
            shadow
          />
        </div>
      )}
      {isLoggedIn && (
        <div className={styles["sidebar-header-bar"]}>
          <IconButton
            icon={<UserIcon />}
            text={narrow ? undefined : "用户中心"}
            className={styles["sidebar-bar-button"]}
            onClick={() => navigate(Path.Profile)}
            shadow
          />
        </div>
      )}
      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<VipIcon />}
          text={narrow ? undefined : "开通会员"}
          className={styles["sidebar-bar-button"]}
          onClick={() => navigate(Path.Pricing)}
          shadow
        />
      </div>
    </div>
  );
}
