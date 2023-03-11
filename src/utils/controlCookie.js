export function setLoginCookie(data) {
  const { accessToken, refreshToken } = data;

  document.cookie = `accessToken=${accessToken}; path=/;`;
  document.cookie = `refreshToken=${refreshToken}; path=/;`;
}
export function setAdminLoginCookie(data) {
  document.cookie = `auth-cookie=${JSON.stringify(data)}; path=/;`;
}
export function clearLoginCookie() {
  document.cookie = `accessToken=; path=/; max-age=0/;`;
  document.cookie = `refreshToken=; path=/; max-age=0/;`;
}
export function clearAdminLoginCookie() {
  document.cookie = `auth-cookie=; path=/; max-age=0/;`;
}
