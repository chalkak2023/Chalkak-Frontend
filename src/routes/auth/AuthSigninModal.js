import { useDispatch, useSelector } from "react-redux";
import { setModalName, setShow } from "../../store/modal.slice";
import { Button, Modal, Form, InputGroup, Stack } from "react-bootstrap";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import { setUser, setLogin } from '../../store/user.slice';
import social from '../../environments/social';
import KakaoLoginImage from './kakao_login.png'
import NaverLoginImage from './naver_login.png'
import apiAxios from '../../utils/api-axios';

function AuthSigninModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let state = useSelector((state) => state);
  let dispatch = useDispatch();

  const handleClose = () => dispatch(setShow(false));

  const naverLoginUri = `https://nid.naver.com/oauth2.0/authorize?response_type=code&state=chalkak&client_id=${social.naverClientId}&redirect_uri=${social.naverRedirectId}`;
  const kakaoLoginUri = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${social.kakaoClientId}&redirect_uri=${social.kakaoRedirectId}`;

  return (
    <Modal size="sm" show={state.modal.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>로그인</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <InputGroup className="mb-2">
              <Form.Control
                id="email"
                name="email"
                type="email"
                placeholder="이메일"
                autoFocus
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </InputGroup>
            <InputGroup>
              <Form.Control
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호"
                autoFocus
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <div className="d-grid gap-2 m-2">
        <Button
          variant="primary"
          onClick={() => {
            login();
          }}
        >
          로그인
        </Button>
        <Button
          variant="outline-dark"
          onClick={() => {
            handleClose();
            showModal("signup");
          }}
        >
          아직 회원가입을 안하셨다면?
        </Button>
        <Stack direction="horizontal" gap={1} className="mb-2">
          <div
            onClick={() => socialLogin(naverLoginUri, "naver")}
            style={{ cursor: "pointer", width: "50%", padding: 0 }}
          >
            <img
              src={NaverLoginImage}
              alt="네이버 로그인 버튼"
              style={{ width: "100%", height: "38px" }}
            />
          </div>
          <div
            className="ms-auto"
            onClick={() => socialLogin(kakaoLoginUri, "kakao")}
            style={{ cursor: "pointer", width: "50%", padding: 0 }}
          >
            <img
              src={KakaoLoginImage}
              alt="카카오 로그인 버튼"
              style={{ width: "100%", height: "38px" }}
            />
          </div>
        </Stack>
      </div>
    </Modal>
  );

  function showModal(modalName) {
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }

  function login() {
    apiAxios
      .post(`/api/auth/signin`, { email, password })
      .then((response) => {
        const statusCode = response.status;
        // console.log('status code: ' + statusCode);
        if (statusCode === 200) {
          alert("로그인 완료");

          const accessToken = response.data.accessToken;

          const userInfo = jwt_decode(accessToken);
          dispatch(setUser(userInfo));
          dispatch(setLogin(true));
          handleClose();
        }
      })
      .catch((e) => {
        console.log("axios 통신실패");
        alert(e.response.data.message);
      });
  }

  function requestSocialLogin(provider, queryParams) {
      const { code, state } = queryParams
      if (!code) {
        alert('로그인할 수 없습니다.')
      }
      const body = { code };
      if (state) {
        body.state = state;
      }
      apiAxios
        .post(`/api/auth/oauth/signin/${provider}`, body)
        .then((response) => {
          const accessToken = response.data.accessToken;
          dispatch(setShow(false));

          const userInfo = jwt_decode(accessToken);
          dispatch(setUser(userInfo));
          dispatch(setLogin(true));
        })
        .catch((err) => {
          return;
        })
  }

  function socialLogin(url) {
    window.requestSocialLogin = requestSocialLogin;
    window.open(url, "social", "width=600,height=600");
  }
}

export default AuthSigninModal;
