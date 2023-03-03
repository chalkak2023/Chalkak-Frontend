import axios from "axios";

const userApiAxios = axios.create({
  baseURL: "http://localhost:8080/api",
});

userApiAxios.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { config } = err;

    if (
      config.url.startsWith("/admin") ||
      config.url === "/auth/refresh" ||
      err.response.status !== 401 ||
      config.sent
    ) {
      return Promise.reject(err);
    }

    config.sent = true;

    const {
      data: { accessToken },
    } = await userApiAxios.get("/auth/refresh", {
      withCredentials: true,
    });

    if (!accessToken) {
      return Promise.reject(err);
    }

    document.cookie = `accessToken=${accessToken}; path=/;`;

    return axios(config);
  }
);

export default userApiAxios;
