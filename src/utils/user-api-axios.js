import axios from "axios";

const userApiAxios = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

userApiAxios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { config } = err;
    const isAdminApi = config.url.startsWith("/admin");
    const refreshUrl = isAdminApi ? "/admin/auth/signin" : "/api/auth/refresh";

    if (
      config.url === refreshUrl ||
      err.response.status !== 401 ||
      config.sent
    ) {
      return Promise.reject(err);
    }

    config.sent = true;

    if (isAdminApi) {
      // TODO: 만약 Admin API가 백엔드에서 쿠키를 지정해주는 방식이 아니라 클라이언트에서 하기로 하면 바꾸어야함
      await userApiAxios.get(refreshUrl);
    } else {
      const {
        data: { accessToken },
      } = await userApiAxios.get(refreshUrl);

      if (!accessToken) {
        return Promise.reject(err);
      }

      document.cookie = `accessToken=${accessToken}; path=/;`;
    }

    return axios(config);
  }
);

export default userApiAxios;
