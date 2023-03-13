export function setLoginCookie(data) {
  const { accessToken, refreshToken } = data;

  // document.cookie = `accessToken=${accessToken}; path=/;`;
  document.cookie = `accessToken=${accessToken}; Domain=chalkak.site; path=/;`;
  if (refreshToken) {
    // document.cookie = `refreshToken=${refreshToken}; path=/;`;
    document.cookie = `refreshToken=${refreshToken}; Domain=chalkak.site; path=/;`;
  }
}
export function setAdminLoginCookie(data) {
  document.cookie = `auth-cookie=${JSON.stringify(data)}; Domain=chalkak.site; path=/;`;
}
export function clearLoginCookie() {
  document.cookie = `accessToken=; Domain=chalkak.site; expires=Thu, 01 Jan 1999 00:00:10 GMT;`;
  document.cookie = `refreshToken=; Domain=chalkak.site; expires=Thu, 01 Jan 1999 00:00:10 GMT;`;
}
export function clearAdminLoginCookie() {
  document.cookie = `auth-cookie=; Domain=chalkak.site; expires=Thu, 01 Jan 1999 00:00:10 GMT;`;
}
