import axios from "axios";
import { setLoginCookie, setAdminLoginCookie, clearLoginCookie, clearAdminLoginCookie } from "./controlCookie";

const apiAxios = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_ADDRESS}`,
  withCredentials: true,
});

apiAxios.interceptors.response.use(
  (res) => {
    const { config } = res
    
    if (res.status === 200 && config.method === 'post' && (config.url === '/api/auth/signin' || config.url.startsWith('/api/auth/oauth/signin'))) {
      setLoginCookie(res.data)
    }
    if (res.status === 200 && config.method === 'post' && config.url === '/admin/auth/signin') {
      setAdminLoginCookie(res.data.jwtData)
    }
    if (res.status === 200 && config.method === 'post' && config.url === '/api/auth/signout') {
      clearLoginCookie();
    }
    if (res.status === 200 && config.method === 'post' && config.url === '/admin/auth/signout') {
      clearAdminLoginCookie();
    }
    return res;
  },
  async (err) => {
    const { config } = err;
    const isAdminApi = config.url.startsWith("/admin");
    const refreshUrl = isAdminApi ? "/admin/auth/signin" : "/api/auth/refresh";

    if (
      config.url.startsWith('/api/auth/emailverification') ||
      config.method === 'post' &&
      config.url === '/api/auth/signup' ||
      config.url === '/api/auth/signin' ||
      config.url.startsWith('/api/auth/oauth/signin')
    ) {
      return Promise.reject(err);
    }

    if (
      config.method === 'get' &&
      config.url === refreshUrl
    ) {
      return Promise.reject(err);
    }

    if (
      err.response.status !== 401 ||
      config.sent
    ) {
      return Promise.reject(err);
    }

    config.sent = true;

    if (isAdminApi) {
      const res = await apiAxios.get(refreshUrl);
      if (!res) {
        return Promise.reject(err);
      }
      setAdminLoginCookie(res.data.jwtData)
    } else {
      const res = await apiAxios.get(refreshUrl);

      if (!res) {
        return Promise.reject(err);
      }
      setLoginCookie(res.data)
    }

    return apiAxios(config);
  }
);

export default apiAxios;
