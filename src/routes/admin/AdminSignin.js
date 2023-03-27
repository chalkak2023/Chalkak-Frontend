import jwt_decode from "jwt-decode";
import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAdmin, setAdminLogin } from '../../store/admin.slice';
import apiAxios from "../../utils/api-axios";

function AdminSignin() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  let dispatch = useDispatch();
  let navigate = useNavigate();

  return (
    <div className="position-absolute top-50 start-50 translate-middle bg-white rounded p-4" style={{minWidth: '300px'}}>
      <h4 className="text-center mb-4">찰칵 관리자 로그인</h4>
      <Form>
        <Form.Group className="d-grid gap-2 m-2">
          <InputGroup>
            <Form.Control id="account" name="account" type="text" placeholder="관리자 계정" autoFocus onChange={(e) => {setAccount(e.target.value);}}/>
          </InputGroup>
          <InputGroup>
            <Form.Control id="password" name="password" type="password" placeholder="비밀번호" autoFocus onKeyUp={enterLogin} onChange={(e) => {setPassword(e.target.value);}}/>
          </InputGroup>
          <Button variant="primary" onClick={() => {login()}}>로그인</Button>
          <Button variant="outline-dark" onClick={() => {navigate('/')}}>찰칵 사이트로 이동</Button>
        </Form.Group>
      </Form>
    </div>
  );

  function enterLogin(e) {
    if(e.key === 'Enter') {
      e.preventDefault();
      if (account && password) {
        login()
      }
    }
  }

  function login() {
    apiAxios
      .post(`/admin/auth/signin`, { account, password })
      .then(({status, data: body}) => {
        if (status === 200) {
          const { accessToken } = body.data
          const adminInfo = jwt_decode(accessToken);
          dispatch(setAdmin(adminInfo));
          dispatch(setAdminLogin(true));
        }
      })
      .catch((e) => {
        if (e.response) {
          alert('로그인하지 못했습니다.')
        }
        console.log(e)
      });
  }
}

export default AdminSignin;
