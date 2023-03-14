const THREE_HOUR = 60 * 60 * 3
const SEVEN_DAY = 60 * 60 * 24 * 7

export function setLoginCookie(data) {
  const { accessToken, refreshToken } = data;

  document.cookie = `accessToken=${accessToken}; Domain=${process.env.REACT_APP_COOKIE_DOMAIN}; path=/; max-age=${THREE_HOUR};${process.env.REACT_APP_ENV === 'production' ? ' secure;' : ''}`;
  if (refreshToken) {
    document.cookie = `refreshToken=${refreshToken}; Domain=${process.env.REACT_APP_COOKIE_DOMAIN}; path=/; max-age=${SEVEN_DAY};${process.env.REACT_APP_ENV === 'production' ? ' secure;' : ''}`;
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
