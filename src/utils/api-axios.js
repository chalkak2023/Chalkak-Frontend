import axios from "axios";

function setLoginCookie(data) {
  const {
    data: { accessToken, refreshToken },
  } = data;

  document.cookie = `accessToken=${accessToken}; path=/;`;
  document.cookie = `refreshToken=${refreshToken}; path=/;`;
}

function setAdminLoginCookie(data) {
  const {
    data: jwtData
  } = data

  document.cookie = `auth-cookie=${JSON.stringify(jwtData)}; path=/;`
}

function clearLoginCookie() {
  document.cookie = `accessToken=; path=/; max-age=0/;`;
  document.cookie = `refreshToken=; path=/; max-age=0/;`;
}

function clearAdminLoginCookie() {
  document.cookie = `auth-cookie=; path=/; max-age=0/;`;
}

const apiAxios = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_ADDRESS}`,
  withCredentials: true,
});

apiAxios.interceptors.response.use(
  (res) => {
    const { config } = res
    
    if (res.status === 200 && config.method === 'post' && config.url === '/api/auth/signin') {
      setLoginCookie(res.data)
    }
    if (res.status === 200 && config.method === 'post' && config.url === '/admin/auth/signin') {
      setAdminLoginCookie(res.data)
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
      config.method === 'get' &&
      config.url === refreshUrl
    ) {
      if (isAdminApi) {
        clearAdminLoginCookie()
      } else {
        clearLoginCookie()
      }
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
      setAdminLoginCookie(res.data)
    } else {
      const res = await apiAxios.get(refreshUrl);

      if (!res) {
        return Promise.reject(err);
      }
      setLoginCookie(res.data)
    }

    return axios(config);
  }
);

export default apiAxios;
