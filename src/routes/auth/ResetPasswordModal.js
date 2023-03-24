import { useDispatch, useSelector } from "react-redux";
import { setShow } from '../../store/modal.slice';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { useState } from "react";
import apiAxios from '../../utils/api-axios';

function ResetPasswordModal() {
  const [email, setEmail] = useState('');

  let state = useSelector((state)=> state );
  let dispatch = useDispatch();

  const handleClose = () => dispatch(setShow(false));

  return (
    <Modal size="sm" show={state.modal.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>비밀번호 재설정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <InputGroup className="mb-2">
              <Form.Control id="email" name="email" type="email" placeholder='이메일' autoFocus onChange={(e) => { setEmail(e.target.value); }}/>
            </InputGroup>
          </Form.Group>
        </Form>
        <div className="d-grid mt-2">
          <Button variant='primary' onClick={()=>{ sendEmail(); }}>비밀번호 재설정 메일 발송</Button>
        </div>
      </Modal.Body>
    </Modal>
  )

  function sendEmail() {
    apiAxios
      .post("/api/auth/emailverification/reset-password", { email })
      .then((response) => {
        const statusCode = response.status;
        if (statusCode === 201) {
          handleClose();
          alert(`비밀번호 재설정 링크를 ${email}로 보냈습니다.`);
        }
      })
      .catch((e) => {
        console.log("axios 통신실패");
        alert(e.response?.data.message);
      });
  }
}

export default ResetPasswordModal;