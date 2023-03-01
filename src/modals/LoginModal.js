// import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setModalName, setShow } from "../store/modal.slice";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let state = useSelector((state) => state);
  let dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setModalName(''));
    dispatch(setShow(false));
  };

  return (
    <Modal size="sm" show={state.modal.show && state.modal.modalName === 'login'} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>로그인</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
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
            <Form.Control
              id="password"
              className="mb-2"
              name="password"
              type="password"
              placeholder="비밀번호"
              autoFocus
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
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
      </div>
    </Modal>
  );

  function login() {
    axios
      .post(`http://localhost:8080/api/auth/signin`, { email, password })
      .then((response) => {
        const statusCode = response.status;
        // console.log('status code: ' + statusCode);
        if (statusCode === 201) {
          alert("로그인완료");
          handleClose()
        }
      })
      .catch((e) => {
        console.log("axios 통신실패");
        alert(e.response.data.message);
      });
  }
}

export default LoginModal;
