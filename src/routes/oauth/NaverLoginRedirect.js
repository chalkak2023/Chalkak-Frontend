import jwt_decode from "jwt-decode";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { setShow } from "../../store/modal.slice";
import { setLogin, setUser } from '../../store/user.slice';
import apiAxios from "../../utils/api-axios";

const NaverLoginRedirect = () => {
  let navigate = useNavigate();
  let dispatch = useDispatch();

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
