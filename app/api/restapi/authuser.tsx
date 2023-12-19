// import axios from "axios";

export async function getUserInfo() {
  // const token = localStorage.getItem("key");
  // const response = await axios.get(
  //   `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/users/me`,
  //   {
  //     headers: { Authorization: `Bearer ${token}` },
  //   },
  // );
  // console.log(response.data);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };
  const userName = getCookie("user_name");
  localStorage.setItem("user_name", userName || "未登录");
}

export function isUserLogin() {
  const loginState = localStorage.getItem("loggedIn");
  if (loginState === "true") {
    return true;
  } else {
    return false;
  }
}

export function isAdmin() {
  const userFid = localStorage.getItem("user_fid");
  if (userFid === "B2A3BEADEC6A4E1BB3B9B9F95FD766F3") {
    return true;
  } else {
    return false;
  }
}

// 允许使用Gpt4的用户
export function gpt4AuthorizedUsers() {
  const userPhone = localStorage.getItem("user_phone");
  if (userPhone === "18157960035" || userPhone === "18957901025") {
    return true;
  } else {
    return false;
  }
}
