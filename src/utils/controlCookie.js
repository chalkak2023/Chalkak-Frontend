export function setLoginCookie(data) {
  const { accessToken, refreshToken } = data;

  document.cookie = `accessToken=${accessToken}; Domain=${process.env.REACT_APP_COOKIE_DOMAIN}; path=/;`;
  if (refreshToken) {
    document.cookie = `refreshToken=${refreshToken}; Domain=${process.env.REACT_APP_COOKIE_DOMAIN}; path=/;`;
  }
}
export function setAdminLoginCookie(data) {
  document.cookie = `auth-cookie=${JSON.stringify(data)}; Domain=${process.env.REACT_APP_COOKIE_DOMAIN}; path=/;`;
}
export function clearLoginCookie() {
  document.cookie = `accessToken=; Domain=${process.env.REACT_APP_COOKIE_DOMAIN}; expires=Thu, 01 Jan 1999 00:00:10 GMT;`;
  document.cookie = `refreshToken=; Domain=${process.env.REACT_APP_COOKIE_DOMAIN}; expires=Thu, 01 Jan 1999 00:00:10 GMT;`;
}
export function clearAdminLoginCookie() {
  document.cookie = `auth-cookie=; Domain=${process.env.REACT_APP_COOKIE_DOMAIN}; expires=Thu, 01 Jan 1999 00:00:10 GMT;`;
}
