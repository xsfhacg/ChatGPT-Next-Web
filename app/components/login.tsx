import React from "react";
import "./login.scss";

interface LoginButtonProps {
  onClick?: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick }) => {
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  const userName = getCookie("user_name");
  const buttonText = userName || "未登录";
  const isDisabled = !!userName;
  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    } else {
      console.log("已登录");
    }
  };

  return (
    <button className="button-login" onClick={handleClick}>
      {buttonText}
    </button>
  );
};

export default LoginButton;
