import { useEffect } from "react";
import apiAxios from "../../utils/api-axios";

const KaKaoLogin = () => {
  useEffect(() => {
    const temp = {};
    new URLSearchParams(window.location.search).forEach((value, key) => {
      temp[key] = value;
    });

    if (temp.code) {
      apiAxios
        .post("/api/auth/oauth/signin/kakao", {
          code: temp.code,
        })
        .then((res) => {
          console.log(res);
          alert("로그인 성공");
        })
        .catch((err) => {
          console.log(err);
          alert("로그인 실패");
        });
    }
  }, []);

  return (
    <div>
      카카오 소셜 로그인 리다이렉트 페이지
    </div>
  )
};

export default KaKaoLogin