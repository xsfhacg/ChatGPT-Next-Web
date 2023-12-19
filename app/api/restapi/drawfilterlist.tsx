export async function drawFilterList() {
  const myHeaders = new Headers();
  myHeaders.append("Access-Control-Allow-Origin", "*");

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  // const url = 'http://apimanage.laifuyun.com/drawFilterWords.txt';
  const url = "/draw_filter_api/drawFilterWords.txt";

  try {
    const response = await fetch(url, requestOptions);
    const text = await response.text();
    // 将文本内容按行分割成字符串数组
    const filterWordsArray = text.split("\n").map((word) => word.trim());
    return filterWordsArray;
  } catch (error) {
    console.log("获取绘图过滤词列表成功出错：" + error);
    return [];
  }
}
