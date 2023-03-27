import jwt_decode from "jwt-decode";
import { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setAdmin, setAdminLogin } from '../../../store/admin.slice';
import { setShow } from "../../../store/modal.slice";
import apiAxios from "../../../utils/api-axios";

function AdminSigninModal() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  let state = useSelector((state) => state);
  let dispatch = useDispatch();

  const handleClose = () => dispatch(setShow(false));

  return (
    <Modal size="sm" show={state.modal.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>관리자 로그인</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <InputGroup className="mb-2">
              <Form.Control id="account" name="account" type="text" placeholder="관리자 계정" autoFocus onChange={(e) => { setAccount(e.target.value); }} />
            </InputGroup>
            <Form.Control id="password" className="mb-2" name="password" type="password" placeholder="비밀번호" autoFocus onKeyUp={enterLogin} onChange={(e) => { setPassword(e.target.value); }} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <div className="d-grid gap-2 m-2">
        <Button variant="primary" onClick={() => { login() }}>로그인</Button>
      </div>
    </Modal>
  );

  function enterLogin(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (account && password) {
        login()
      }
    }
  }

  function login() {
    apiAxios
      .post(`/admin/auth/signin`, { account, password })
      .then(({ status, data: body }) => {
        if (status === 200) {
          alert("로그인 완료");
          const { accessToken } = body.jwtData
          const adminInfo = jwt_decode(accessToken);
          dispatch(setAdmin(adminInfo));
          dispatch(setAdminLogin(true));
          handleClose();
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

export default AdminSigninModal;
