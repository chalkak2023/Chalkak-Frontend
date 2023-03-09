import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setModalName, setShow } from "../../store/modal.slice";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import { setUser, setLogin } from '../../store/user.slice';
import social from '../../environments/social';
import KakaoLoginImage from './kakao_login.png'
import NaverLoginImage from './naver_login.png'

function AuthSigninModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let state = useSelector((state) => state);
  let dispatch = useDispatch();

  const handleClose = () => dispatch(setShow(false));

  const naverLoginUri = `https://nid.naver.com/oauth2.0/authorize?response_type=code&state=chalkak&client_id=${social.naverClientId}&redirect_uri=${social.naverRedirectId}`
  const kakaoLoginUri = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${social.kakaoClientId}&redirect_uri=${social.kakaoRedirectId}`

  return (
    <Modal size="sm" show={state.modal.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>로그인</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <InputGroup className="mb-2">
              <Form.Control id="email" name="email" type="email" placeholder="이메일" autoFocus onChange={(e) => {setEmail(e.target.value);}}/>
            </InputGroup>
            <Form.Control id="password" className="mb-2" name="password" type="password" placeholder="비밀번호" autoFocus onChange={(e) => {setPassword(e.target.value);}}/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <div className="d-grid gap-2 m-2">
        <Button variant="primary" onClick={() => {login()}}>로그인</Button>
        <Button variant="outline-dark" onClick={()=>{handleClose();showModal('signup');}}>아직 회원가입을 안하셨다면?</Button>
        <div onClick={() => socialLogin(naverLoginUri)} style={{cursor: 'pointer'}}>
          <img src={NaverLoginImage} alt="네이버 로그인 버튼" />
        </div>
        <div onClick={() => socialLogin(kakaoLoginUri)} style={{cursor: 'pointer'}}>
          <img src={KakaoLoginImage} alt="카카오 로그인 버튼" />
        </div>
      </div>
    </Modal>
  );

  function showModal(modalName) {
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }

  function login() {
    axios
      .post(`http://localhost:8080/api/auth/signin`, { email, password })
      .then((response) => {
        const statusCode = response.status;
        // console.log('status code: ' + statusCode);
        if (statusCode === 200) {
          alert("로그인 완료");

          const accessToken = response.data.accessToken;
          const refreshToken = response.data.refreshToken;
          document.cookie = `accessToken=${accessToken}; path=/;`;
          document.cookie = `refreshToken=${refreshToken}; path=/;`;

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
  
  function afterSocialLogin({ accessToken, refreshToken, err }) {
    if (err) {
      return ;
    }
    dispatch(setShow(false));

    document.cookie = `accessToken=${accessToken}; path=/;`;
    document.cookie = `refreshToken=${refreshToken}; path=/;`;

    const userInfo = jwt_decode(accessToken);
    dispatch(setUser(userInfo));
    dispatch(setLogin(true));
  }

  function socialLogin(url) {
    window.afterSocialLogin = afterSocialLogin
    window.open(url, 'social', 'width=700px,height=800px,scrollbars=no')
  }

}

export default AuthSigninModal;
