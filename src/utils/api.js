const API_END_POINT =
  "https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev";

export const request = async (nodeId) => {
  try {
    const result = await fetch(`${API_END_POINT}/${nodeId ? nodeId : ""}`);
    if (!request.ok) {
      throw new Error("서버 문제가 발생했습니다!");
    }
    return await result.json();
  } catch (e) {
    throw new Error("api 호출에 문제가 발생했습니다!", e.message);
  }
};
