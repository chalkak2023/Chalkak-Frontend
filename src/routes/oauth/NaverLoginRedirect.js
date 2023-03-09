import { useEffect } from "react";
import apiAxios from "../../utils/api-axios";
import Loading from '../components/loading/Loading'

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
          window.opener?.afterSocialLogin({accessToken, refreshToken})
        })
        .catch((err) => {
          window.opener?.afterSocialLogin({err})
        })
        .finally(() => {
          window.close()
        })
    }
  }, []);

  return (
    <div>
      <Loading />
    </div>
  )
};

export default NaverLoginRedirect;
