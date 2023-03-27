import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { setLogin, setUser } from "../../store/user.slice";
import apiAxios from "../../utils/api-axios";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(false);

  let navigate = useNavigate();
  let dispatch = useDispatch();

  useEffect(() => {
    const queryParams = {};
    new URLSearchParams(window.location.search).forEach((value, key) => {
      queryParams[key] = value;
    });

    if (queryParams.email === undefined || queryParams.verifyToken === undefined) {
      alert('잘못된 접근입니다.')
      navigate('/');
    }

    setEmail(queryParams.email);
    setVerifyToken(queryParams.verifyToken);
  }, []);

  useEffect(() => {
    const disabled =
      typeof password !== "string" ||
      password.trim().length === 0 ||
      password !== confirmPassword

    setSubmitDisabled(disabled);
  }, [password, confirmPassword]);

  return (
    <div className="position-absolute top-50 start-50 translate-middle bg-white rounded p-4" style={{minWidth: '300px'}}>
    <h4 className="text-center mb-4">찰칵 비밀번호 재설정</h4>
      <Form>
        <Form.Group className="d-grid gap-2 m-2">
          <InputGroup>
            <Form.Control id="email" name="email" type="email" placeholder="이메일" defaultValue={email} disabled autoFocus/>
          </InputGroup>
          <InputGroup>
            <Form.Control id="password" name="password" type="password" placeholder="비밀번호" autoFocus onChange={(e) => {setPassword(e.target.value);}}/>
          </InputGroup>
          <InputGroup>
            <Form.Control id="confirm_password" className='mb-2' name="confirm_password" type="password" placeholder='비밀번호확인' autoFocus onChange={(e) => { setConfirmPassword(e.target.value); }} />
          </InputGroup>
          <Button variant="primary" disabled={submitDisabled} onClick={() => {resetPassword()}}>비밀번호 재설정</Button>
          <Button variant="outline-dark" onClick={() => {navigate('/')}}>찰칵 사이트로 이동</Button>
        </Form.Group>
      </Form>
    </div>
  );

  function resetPassword() {
    if (password === '') {
      alert('비밀번호는 반드시 입력해야합니다.')
      return ;
    }
    if (password !== confirmPassword) {
      alert('비밀번호가 비밀번호 확인과 다릅니다.')
      return ;
    }
    apiAxios
    .put("/api/auth/emailverification/reset-password", { email, verifyToken, password })
    .then((response) => {
      const statusCode = response.status;
      console.log("status code: " + statusCode);
      if (statusCode === 200) {
        alert(`비밀번호를 재설정했습니다.`);
        login();
      }
    })
    .catch((e) => {
      console.log("axios 통신실패");
      alert(e.response?.data.message);
    });
  }

  function login() {
    apiAxios
      .post(`/api/auth/signin`, { email, password })
      .then((response) => {
        const statusCode = response.status;
        // console.log('status code: ' + statusCode);
        if (statusCode === 200) {
          const accessToken = response.data.accessToken;

          const userInfo = jwt_decode(accessToken);
          dispatch(setUser(userInfo));
          dispatch(setLogin(true));
          navigate('/');
        }
      })
      .catch((e) => {
        console.log("axios 통신실패");
        alert(e.response?.data.message);
      });
  }
}

export default ResetPassword;