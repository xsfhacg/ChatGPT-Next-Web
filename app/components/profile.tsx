import { useState, useEffect, useCallback } from "react";

import styles from "./profile.module.scss";

import CloseIcon from "../icons/close.svg";
import { Input, List, ListItem, Modal, PasswordInput } from "./ui-lib";

import { IconButton } from "./button";
import {
  // useAuthStore,
  // useAccessStore,
  useAppConfig,
  useProfileStore,
  // useWebsiteConfigStore,
} from "../store";

import Locale from "../locales";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { useNavigate } from "react-router-dom";
import { showToast, Popover } from "./ui-lib";
import { Avatar, AvatarPicker } from "./emoji";

export function Profile() {
  const navigate = useNavigate();
  // const authStore = useAuthStore();
  // const accessStore = useAccessStore();
  const profileStore = useProfileStore();
  // const { registerTypes } = useWebsiteConfigStore();
  // const registerType = registerTypes[0];
  // const REG_TYPE_USERNAME_AND_EMAIL_WITH_CAPTCHA_AND_CODE =
  // "UsernameAndEmailWithCaptchaAndCode";

  const config = useAppConfig();
  const updateConfig = config.update;

  const [loadingUsage, setLoadingUsage] = useState(false);

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

  // 清空cookie
  function clearAllCookie() {
    console.log("清空cookie");
    try {
      // var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      // if (keys) {
      //   for (var i = keys.length; i--; )
      //     document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString();
      // }

      const domain = ".orangeui.cn";
      const cookies = document.cookie.split(";");
      cookies.forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${domain}; path=/`;
      });
    } catch (error) {
      console.error("清空cookie失败: ", error);
    }
  }

  // 登出
  const logout = useCallback(() => {
    console.log("~~~开始登出~~~");
    clearAllCookie();
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("appid");
    localStorage.removeItem("user_fid");
    localStorage.removeItem("login_key");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_phone");
    localStorage.removeItem("user_email");
    localStorage.removeItem("wx_open_id");
    localStorage.removeItem("operate_type");

    window.dispatchEvent(new Event("customEvent"));

    setTimeout(() => {
      navigate(Path.LoginRegister);
    }, 500);
  }, [navigate]);

  // 判断登录状态，未登录就跳转到注册
  const { fetchProfile } = profileStore;
  useEffect(() => {
    const loginKey = localStorage.getItem("login_key");
    if (loginKey && loginKey.length > 0) {
      fetchProfile(loginKey).then((res) => {
        if (res.Code !== 200) {
          alert(res.Desc);
        }
      });
    } else {
      console.log("不存在key,跳转到登录界面");
      navigate(Path.LoginRegister);
    }
  }, [fetchProfile, navigate]);

  // 判断登录状态，未登录就跳转到注册
  // useEffect(() => {
  //   const loginState = localStorage.getItem("loggedIn");
  //   if (!loginState) {
  //     navigate(Path.LoginRegister);
  //   }
  // }, [navigate]);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <ErrorBoundary>
      {/* 标题栏 */}
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">{Locale.Profile.Title}</div>
          <div className="window-header-sub-title">
            {/* {Locale.Profile.SubTitle} */}
          </div>
        </div>
        <div className="window-actions">
          <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
              title={Locale.Profile.Actions.Close}
            />
          </div>
        </div>
      </div>

      {/* 个人中心 */}
      <div className={styles["profile"]}>
        <List>
          {/* 头像 */}
          <ListItem title={Locale.Settings.Avatar}>
            <Popover
              onClose={() => setShowEmojiPicker(false)}
              content={
                <AvatarPicker
                  onEmojiClick={(avatar: string) => {
                    updateConfig((config) => (config.avatar = avatar));
                    setShowEmojiPicker(false);
                  }}
                />
              }
              open={showEmojiPicker}
            >
              <div
                className={styles.avatar}
                onClick={() => setShowEmojiPicker(true)}
              >
                <Avatar avatar={config.avatar} />
              </div>
            </Popover>
          </ListItem>

          {/* 用户名 */}
          <ListItem title={Locale.Profile.Username}>
            <span>{localStorage.getItem("user_name")}</span>
          </ListItem>

          {/* 是否绑定微信 */}
          <ListItem title={Locale.Profile.WxOpenId}>
            {localStorage.getItem("wx_open_id") !== "" ? (
              <span>已绑定</span>
            ) : (
              <IconButton
                text={Locale.Profile.ToBind}
                type="primary"
                onClick={() => {
                  localStorage.setItem("operate_type", "bind_wx");
                  navigate(Path.LoginRegister);
                }}
              />
            )}
          </ListItem>

          {/* 手机号 */}
          <ListItem title={Locale.Profile.Phone}>
            {localStorage.getItem("user_phone") !== "未设置" ? (
              <span>{localStorage.getItem("user_phone")}</span>
            ) : (
              <IconButton
                text={Locale.Profile.ToBind}
                type="primary"
                onClick={() => {
                  localStorage.setItem("operate_type", "bind_phone");
                  navigate(Path.LoginRegister);
                }}
              />
            )}
          </ListItem>

          {/* 邮箱 */}
          <ListItem title={Locale.Profile.Email}>
            <span>{localStorage.getItem("user_email")}</span>
          </ListItem>
        </List>

        <List>
          {/* GPT3.5每日免费次数 */}
          <ListItem title={Locale.Profile.ChatCount.FreeTitle}>
            <span>{profileStore.free_chat_count}</span>
          </ListItem>

          {/* GPT4.0每日免费次数 */}
          {/* <ListItem title={Locale.Profile.AdvanceChatCount.FreeTitle}>
            <span>{profileStore.free_advanced_chat_count}</span>
          </ListItem> */}

          {/* 绘图每日免费次数 */}
          {/* <ListItem title={Locale.Profile.DrawCount.FreeTitle}>
            <span>{profileStore.freer_draw_count}</span>
          </ListItem> */}
        </List>

        <List>
          {/* 剩余tokens数量 */}
          {/* <ListItem
            title={Locale.Profile.Tokens.Title}
            // subTitle={Locale.Profile.Tokens.SubTitle}
          >
            <span>
              {profileStore.limit_tokens == -1
                ? "无限制"
                : profileStore.limit_tokens}
            </span>
          </ListItem> */}

          {/* 套餐剩余GPT3.5次数 */}
          <ListItem
            title={Locale.Profile.ChatCount.Title}
            // subTitle={Locale.Profile.ChatCount.SubTitle}
          >
            <span>
              {profileStore.limit_chat_count == -1
                ? "无限制"
                : profileStore.limit_chat_count}
            </span>
          </ListItem>

          {/* 套餐剩余GPT4次数 */}
          {/* <ListItem
            title={Locale.Profile.AdvanceChatCount.Title}
            // subTitle={Locale.Profile.AdvanceChatCount.SubTitle}
          >
            <span>
              {profileStore.limit_advanced_chat_count == -1
                ? "无限制"
                : profileStore.limit_advanced_chat_count}
            </span>
          </ListItem> */}

          {/* 套餐剩余绘图次数 */}
          {/* <ListItem
            title={Locale.Profile.DrawCount.Title}
            // subTitle={Locale.Profile.DrawCount.SubTitle}
          >
            <span>
              {profileStore.limit_draw_count == -1
                ? "无限制"
                : profileStore.limit_draw_count}
            </span>
          </ListItem> */}

          {/* 套餐过期时间 */}
          {profileStore.expiresTime && profileStore.expiresTime.length > 0 ? (
            <ListItem
              title={Locale.Profile.ExpireList.Title}
              subTitle={Locale.Profile.ExpireList.SubTitle}
            >
              <span>{profileStore.expiresTime}</span>
            </ListItem>
          ) : (
            <></>
          )}

          {/* 更多 */}
          {/* <ListItem title={Locale.Profile.Actions.GoToBalanceList}>
            <IconButton
              text={Locale.Profile.Actions.GoToBalanceList}
              onClick={() => {
                showToast(Locale.Profile.Actions.ConsultAdministrator);
              }}
            />
          </ListItem> */}
        </List>

        <List>
          {/* 购买套餐 */}
          <ListItem title={Locale.Profile.Actions.Pricing}>
            <IconButton
              text={Locale.Profile.Actions.Pricing}
              // block={true}
              type="primary"
              onClick={() => {
                navigate(Path.Pricing);
              }}
            />
          </ListItem>

          {/* 登出 */}
          <ListItem title={Locale.LoginRegister.Actions.Logout}>
            <IconButton
              text={Locale.LoginRegister.Actions.Logout}
              // block={true}
              type="primary"
              onClick={() => {
                logout();
              }}
            />
          </ListItem>
        </List>
      </div>
    </ErrorBoundary>
  );
}
