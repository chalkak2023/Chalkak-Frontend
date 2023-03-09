import { useEffect } from "react";
import apiAxios from "../../utils/api-axios";

const NaverLoginRedirect = () => {

  useEffect(() => {
    const temp = {};
    new URLSearchParams(window.location.search).forEach((value, key) => {
      temp[key] = value;
    });

    if (temp.code) {
      apiAxios
        .post("/api/auth/oauth/signin/naver", {
          code: temp.code,
          state: temp.state,
        })
        .then((response) => {
          const accessToken = response.data.accessToken;
          const refreshToken = response.data.refreshToken;
          window.opener?.postMessage({accessToken, refreshToken}, '*')
        })
        .catch((err) => {
          window.opener?.postMessage({err}, '*')
        })
        .finally(() => {
          window.close()
        })
    }
  }, []);

  return (
    <div>
      네이버 소셜 로그인 리다이렉트 페이지
    </div>
  )
};

export default NaverLoginRedirect;
