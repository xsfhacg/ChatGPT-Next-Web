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
