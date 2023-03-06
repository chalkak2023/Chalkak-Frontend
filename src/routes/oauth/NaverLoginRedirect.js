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
          alert("로그인 성공");
          const accessToken = response.data.accessToken;
          const refreshToken = response.data.refreshToken;
          document.cookie = `accessToken=${accessToken}; path=/;`;
          document.cookie = `refreshToken=${refreshToken}; path=/;`;

          const userInfo = jwt_decode(accessToken);
          dispatch(setUser(userInfo));
          dispatch(setLogin(true));
          dispatch(setShow(false));
          navigate('/')
        })
        .catch((err) => {
          console.log(err);
          alert("로그인 실패");
        });
    }
  }, []);

  return (
    <div>
      네이버 소셜 로그인 리다이렉트 페이지
    </div>
  )
};

export default NaverLoginRedirect;
