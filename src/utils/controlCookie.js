export function setLoginCookie(data) {
  const { accessToken, refreshToken } = data;

  document.cookie = `accessToken=${accessToken}; path=/;`;
  if (refreshToken) {
    document.cookie = `refreshToken=${refreshToken}; path=/;`;
  }
}
export function setAdminLoginCookie(data) {
  document.cookie = `auth-cookie=${JSON.stringify(data)}; path=/;`;
}
export function clearLoginCookie() {
  document.cookie = `accessToken=; expires=Thu, 01 Jan 1999 00:00:10 GMT;`;
  document.cookie = `refreshToken=; expires=Thu, 01 Jan 1999 00:00:10 GMT;`;
}
export function clearAdminLoginCookie() {
  document.cookie = `auth-cookie=; expires=Thu, 01 Jan 1999 00:00:10 GMT;`;
}
