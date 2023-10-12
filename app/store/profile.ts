import { create } from "zustand";
import { persist } from "zustand/middleware";
// import { Balance, ProfileResponse } from "../api/users/[...path]/route";
import { Path, StoreKey } from "../constant";
// import { DataArray } from "@mui/icons-material";

export interface ProfileStore {
  user_id: string; // 用户id

  // today_tokens: number; // 今日消耗tokens
  // today_chat_count: number; // 今日消耗3.5次数
  // today_advanced_chat_count: number; // 今日消耗4.0次数
  // today_draw_count: number; // 今日消耗绘图次数

  // total_tokens: number; // 总消耗tokens
  // total_chat_count: number; // 总消耗3.5次数
  // total_advanced_chat_count: number; // 总消耗4.0次数
  // total_draw_count: number; // 总消耗绘图次数

  free_tokens: number; // 每日免费tokens
  free_chat_count: number; // 每日免费3.5次数
  free_advanced_chat_count: number; // 每日免费4.0次数
  freer_draw_count: number; // 每日免费绘图次数

  limit_tokens: number; // 套餐剩余tokens
  limit_chat_count: number; // 套餐剩余3.5次数
  limit_advanced_chat_count: number; // 套餐剩余4.0次数
  limit_draw_count: number; // 套餐剩余绘图次数
  expiresTime: string; // 套餐过期时间

  fetchProfile: (token: string) => Promise<any>;
}

let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      user_id: "",

      // today_tokens: 0,
      today_chat_count: 0,
      today_advanced_chat_count: 0,
      today_draw_count: 0,

      // total_tokens: 0,
      total_chat_count: 0,
      total_advanced_chat_count: 0,
      total_draw_count: 0,

      free_tokens: 0,
      free_chat_count: 0,
      free_advanced_chat_count: 0,
      freer_draw_count: 0,

      limit_tokens: 0,
      limit_chat_count: 0,
      limit_advanced_chat_count: 0,
      limit_draw_count: 0,

      expiresTime: "",

      async fetchProfile(token: string) {
        // const url = "/users/profile";
        // const BASE_URL = process.env.BASE_URL;
        // const mode = process.env.BUILD_MODE;
        // let requestUrl = mode === "export" ? BASE_URL + url : "/api" + url;
        let requestUrl =
          "http://www.orangeui.cn:10030/usercenter/get_user_info?&is_need_chatgpt_use_status=1&key=" +
          token;
        return fetch(requestUrl, {
          method: "get",
          // headers: {
          //   Authorization: "Bearer " + token,
          // },
          body: null,
        })
          .then((res) => res.json())
          .then((res) => {
            console.log("[Profile] 从服务器获取用户配置：", res);
            const data = res.Data;
            if (res.Code === 200) {
              set(() => ({
                user_id: data.fid,

                // today_tokens: data.today_tokens,
                today_chat_count: data.today_chat_count,
                today_advanced_chat_count: data.today_advanced_chat_count,
                today_draw_count: data.today_draw_count,

                // total_tokens: data.total_tokens,
                total_chat_count: data.total_chat_count,
                total_advanced_chat_count: data.total_advanced_chat_count,
                total_draw_count: data.total_draw_count,

                free_tokens: data.free_tokens,
                free_chat_count: data.free_chat_count,
                free_advanced_chat_count: data.free_advanced_chat_count,
                freer_draw_count: data.freer_draw_count,

                limit_tokens: data.limit_tokens,
                limit_chat_count: data.limit_chat_count,
                limit_advanced_chat_count: data.limit_advanced_chat_count,
                limit_draw_count: data.limit_draw_count,

                expiresTime: data.expiresTime,
              }));
            } else {
              console.log(" [Profile] 获取用户配置失败 ");
              // set(() => ({
              //   user_id: '',
              //   tokens: 0,
              //   chatCount: 0,
              //   advanceChatCount: 0,
              //   drawCount: 0,
              //   balances: [],
              //   expiresTime: '',
              // }));
            }
            return res;
          })
          .catch(() => {
            console.error("[Profile] 获取用户配置失败");
          })
          .finally(() => {
            // fetchState = 2;
          });
      },
    }),
    {
      // name: StoreKey.Profile,
      name: Path.Profile,
      version: 1,
    },
  ),
);
