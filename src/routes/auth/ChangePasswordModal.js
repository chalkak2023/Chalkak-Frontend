import { useDispatch, useSelector } from "react-redux";
import { setModalName, setShow } from '../../store/modal.slice';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { useEffect, useState } from "react";
import apiAxios from '../../utils/api-axios';

function ChangePasswordModal() {
  const [isSending, setIsSending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifyToken, setVerifyToken] = useState('');

  let state = useSelector((state)=> state );
  let dispatch = useDispatch();

  const handleClose = () => dispatch(setShow(false));

  return (
    <Modal size="sm" show={state.modal.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>비밀번호 변경</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <div className="d-grid gap-2 m-2">
              <Button variant="outline-success" onClick={()=>{ sendEmail(); }}>인증번호 발송</Button>
            </div>
            {isSending ? <Form.Text>메일 보내는 중...</Form.Text> : ''}
            <InputGroup className="mb-2">
              <Form.Control id="p_confirm_email" name="confirm_email" type="text" placeholder='인증번호' autoFocus onChange={(e) => { setVerifyToken(e.target.value); }}/>
              <Button variant="outline-success" onClick={()=>{ confirmEmail(); }}>인증번호 확인</Button>
            </InputGroup>
            <Form.Control id="p_password" className='mb-2' name="password" type="password" placeholder='새 비밀번호' autoFocus onChange={(e) => { setPassword(e.target.value); }} />
            <Form.Control id="p_confirm_password" className='mb-2' name="confirm_password" type="password" placeholder='새 비밀번호확인' autoFocus onChange={(e) => { setConfirmPassword(e.target.value); }} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <div className="d-grid gap-2 m-2">
        <Button variant="primary" onClick={()=>{ changePassword(); }}>비밀번호 변경</Button>
      </div>
    </Modal>
  )

  function showModal(modalName) {
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }

  function confirmEmail() {
    apiAxios
      .put(`/api/auth/emailverification/password`, { verifyToken })
      .then((response) => {
        const statusCode = response.status;
        // console.log('status code: ' + statusCode);
        if (statusCode === 200) {
          alert(response.data.message);
          setIsVerified(true);
        }
      })
      .catch((e) => {
        console.log('axios 통신실패');
        alert(e.response?.data.message);
      });
  }

  function sendEmail() {
    setIsSending(true);
    apiAxios
      .post('/api/auth/emailverification/password', {})
      .then((response) => {
        const statusCode = response.status;
        console.log('status code: ' + statusCode);
        if (statusCode === 201) {
          setIsSending(false);
          alert(`인증번호를 ${state.user.data?.email}로 보냈습니다.`);
        }
      })
      .catch((e) => {
        console.log('axios 통신실패');
        alert(e.response?.data.message);
      });
  }

  function changePassword() {
    if (!isVerified) {
      alert('이메일 인증이 필요합니다.');
      return;
    }
    if (password !== confirmPassword) {
      alert('비밀번호가 비밀번호 확인과 다릅니다.')
      return;
    }
    apiAxios
      .patch("/api/auth", { password })
      .then((response) => {
        const statusCode = response.status;
        console.log("status code: " + statusCode);
        if (statusCode === 200) {
          alert(response.data.message);
          handleClose()
        }
      })
      .catch((e) => {
        console.log("axios 통신실패");
        alert(e.response?.data.message);
      });
  }
}

export default ChangePasswordModal;