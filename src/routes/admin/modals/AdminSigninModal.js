import axios from "axios";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setAdmin, setAdminLogin } from '../../../store/admin.slice';
import { setShow } from "../../../store/modal.slice";

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
              <Form.Control id="account" name="email" type="email" placeholder="관리자 계정" autoFocus onChange={(e) => {setAccount(e.target.value);}}/>
            </InputGroup>
            <Form.Control id="password" className="mb-2" name="password" type="password" placeholder="비밀번호" autoFocus onChange={(e) => {setPassword(e.target.value);}}/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <div className="d-grid gap-2 m-2">
        <Button variant="primary" onClick={() => {login()}}>로그인</Button>
      </div>
    </Modal>
  );

  function login() {
    axios
      .post(`${process.env.REACT_APP_SERVER_ADDRESS}/admin/auth/signin`, { account, password })
      .then(({status, data: body}) => {
        if (status === 200) {
          alert("로그인 완료");
          
          // TODO: 백엔드가 아니라 클라이언트에서 쿠키를 설정한다면 여기에서 설정해줘야함.
          const { accessToken } = body.data
          const adminInfo = jwt_decode(accessToken);
          dispatch(setAdmin(adminInfo));
          dispatch(setAdminLogin(true));
          handleClose();
        }
      })
      .catch((e) => {
        console.log("axios 통신실패");
        alert(e.response.data.message);
      });
  }
}

export default AdminSigninModal;
