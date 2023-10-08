"use client";

require("../polyfill");

import { useState, useEffect } from "react";

import styles from "./home.module.scss";

import BotIcon from "../icons/bot.svg";
import LoadingIcon from "../icons/three-dots.svg";

import { getCSSVar, useMobileScreen } from "../utils";

import dynamic from "next/dynamic";
import { Path, SlotID } from "../constant";
import { ErrorBoundary } from "./error";

import { getISOLang, getLang } from "../locales";

import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { SideBar } from "./sidebar";
import { useAppConfig } from "../store/config";
import { AuthPage } from "./auth";
import { getClientConfig } from "../config/client";
import { api } from "../client/api";
import { useAccessStore } from "../store";

// 顶部导航栏
import TopNavigation from "./top-navigation";
// 登录按钮
// import LoginButton from "./login";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"] + " no-dark"}>
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}

const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo />,
});

const Chat = dynamic(async () => (await import("./chat")).Chat, {
  loading: () => <Loading noLogo />,
});

const NewChat = dynamic(async () => (await import("./new-chat")).NewChat, {
  loading: () => <Loading noLogo />,
});

const MaskPage = dynamic(async () => (await import("./mask")).MaskPage, {
  loading: () => <Loading noLogo />,
});

const LoginRegister = dynamic(
  async () => (await import("./login-register")).LoginRegister,
  {
    loading: () => <Loading noLogo />,
  },
);

const Profile = dynamic(async () => (await import("./profile")).Profile, {
  loading: () => <Loading noLogo />,
});

const Pricing = dynamic(async () => (await import("./pricing")).Pricing, {
  loading: () => <Loading noLogo />,
});

export function useSwitchTheme() {
  const config = useAppConfig();

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const metaDescriptionDark = document.querySelector(
      'meta[name="theme-color"][media*="dark"]',
    );
    const metaDescriptionLight = document.querySelector(
      'meta[name="theme-color"][media*="light"]',
    );

    if (config.theme === "auto") {
      metaDescriptionDark?.setAttribute("content", "#151515");
      metaDescriptionLight?.setAttribute("content", "#fafafa");
    } else {
      const themeColor = getCSSVar("--theme-color");
      metaDescriptionDark?.setAttribute("content", themeColor);
      metaDescriptionLight?.setAttribute("content", themeColor);
    }
  }, [config.theme]);
}

function useHtmlLang() {
  useEffect(() => {
    const lang = getISOLang();
    const htmlLang = document.documentElement.lang;

    if (lang !== htmlLang) {
      document.documentElement.lang = lang;
    }
  }, []);
}

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

const loadAsyncGoogleFont = () => {
  const linkEl = document.createElement("link");
  const proxyFontUrl = "/google-fonts";
  const remoteFontUrl = "https://fonts.googleapis.com";
  const googleFontUrl =
    getClientConfig()?.buildMode === "export" ? remoteFontUrl : proxyFontUrl;
  linkEl.rel = "stylesheet";
  linkEl.href =
    googleFontUrl +
    "/css2?family=" +
    encodeURIComponent("Noto Sans:wght@300;400;700;900") +
    "&display=swap";
  document.head.appendChild(linkEl);
};

function Screen() {
  const config = useAppConfig();
  const location = useLocation();
  const isHome = location.pathname === Path.Home;
  const isAuth = location.pathname === Path.Auth;
  const isMobileScreen = useMobileScreen();
  const shouldTightBorder =
    config.tightBorder && !isMobileScreen && !getClientConfig()?.isApp;

  const links = [
    // { to: '/', label: 'Home' },
    // { to: '/new-chat', label: 'New Chat' },
    // { to: '/masks', label: 'Masks' },
    // { to: '/chat', label: 'Chat' },
    // { to: '/settings', label: 'Settings' },

    // 添加外部链接
    { to: "/", label: "ChatGPT" },
    {
      to: { pathname: "http://www.orangeui.cn", isExternal: true },
      label: "OrangeUI",
    },
    {
      to: { pathname: "http://www.orangeui.cn/download", isExternal: true },
      label: "下载",
    },
    {
      to: { pathname: "http://www.orangeui.cn/cusomer-case", isExternal: true },
      label: "案例",
    },
    {
      to: { pathname: "http://www.orangeui.cn/components", isExternal: true },
      label: "文档",
    },
    {
      to: { pathname: "http://www.orangeui.cn/delphiapp", isExternal: true },
      label: "App开发教程",
    },
    {
      to: {
        pathname: "https://github.com/DelphiTeacher/OrangeUI",
        isExternal: true,
      },
      label: "GitHub",
    },
    {
      to: { pathname: "http://www.orangeui.cn/wordpress", isExternal: true },
      label: "Blog",
    },
  ];
  // const handleButtonClick = () => {
  //   const callbackUrl = encodeURIComponent(window.location.href);
  //   const url = `https://www.orangeui.cn/login.html?appid=1000&api_name=delphi_area_web_api&callback_url=${callbackUrl}`;
  //   window.location.href = url;
  // };

  const callbackUrl = encodeURIComponent(window.location.href);
  const loginUrl = `https://www.orangeui.cn/login.html?appid=1000&api_name=delphi_area_web_api&callback_url=${callbackUrl}`;

  useEffect(() => {
    loadAsyncGoogleFont();
  }, []);

  return (
    <div
      className={
        styles.container +
        ` ${shouldTightBorder ? styles["tight-container"] : styles.container} ${
          getLang() === "ar" ? styles["rtl-screen"] : ""
        }`
      }
    >
      {/* 添加 TopNavigation 组件 */}
      {!isAuth && !isMobileScreen && <TopNavigation links={links} />}

      {/* 添加登录按钮 */}
      {/* {!isAuth && !isMobileScreen && ( <LoginButton onClick={handleButtonClick} /> )} */}

      {isAuth ? (
        <>
          <AuthPage />
        </>
      ) : (
        <>
          <SideBar className={isHome ? styles["sidebar-show"] : ""} />

          <div className={styles["window-content"]} id={SlotID.AppBody}>
            <Routes>
              <Route path={Path.Home} element={<Chat />} />
              <Route path={Path.NewChat} element={<NewChat />} />
              <Route path={Path.Masks} element={<MaskPage />} />
              <Route path={Path.Chat} element={<Chat />} />
              <Route path={Path.Settings} element={<Settings />} />

              <Route
                path={Path.LoginRegister}
                element={<LoginRegister url={loginUrl} />}
              />
              <Route path={Path.Profile} element={<Profile />} />
              <Route path={Path.Pricing} element={<Pricing />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

export function useLoadData() {
  const config = useAppConfig();

  useEffect(() => {
    (async () => {
      const models = await api.llm.models();
      config.mergeModels(models);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function Home() {
  useSwitchTheme();
  useLoadData();
  useHtmlLang();

  useEffect(() => {
    console.log("[Config] got config from build time", getClientConfig());
    useAccessStore.getState().fetch();
  }, []);

  if (!useHasHydrated()) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Screen />
      </Router>
    </ErrorBoundary>
  );
}
