import { useDispatch, useSelector } from "react-redux";
import { setModalName, setShow } from '../../store/modal.slice';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { useState } from "react";
import apiAxios from '../../utils/api-axios';

function AuthSignupModal() {
  const [isSending, setIsSending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verifyToken, setVerifyToken] = useState('');

  let state = useSelector((state)=> state );
  let dispatch = useDispatch();

  const handleClose = () => dispatch(setShow(false));

  return (
    <Modal size="sm" show={state.modal.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>회원가입</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <InputGroup className="mb-2">
              <Form.Control disabled={isVerified} id="email" name="email" type="email" placeholder='이메일' autoFocus onChange={(e) => { setEmail(e.target.value); setIsVerified(false); }}/>
              <Button disabled={isVerified} variant="success" onClick={()=>{ sendEmail(); }}>인증번호 전송</Button>
            </InputGroup>
            {isSending ? <Form.Text>메일 보내는 중...</Form.Text> : ''}
            <InputGroup className="mb-2">
              <Form.Control disabled={isVerified} id="confirm_email" name="confirm_email" type="text" placeholder='인증번호' autoFocus onChange={(e) => { setVerifyToken(e.target.value); }}/>
              <Button disabled={isVerified} variant="outline-success" onClick={()=>{ confirmEmail(); }}>인증번호 확인</Button>
            </InputGroup>
            {isVerified ? <Form.Text>메일 인증이 완료되었습니다.</Form.Text> : ''}
            <Form.Control id="nickname" className='mb-2' name="nickname" type="text" placeholder='닉네임' autoFocus onChange={(e) => { setUsername(e.target.value); }} />
            <Form.Control id="password" className='mb-2' name="password" type="password" placeholder='비밀번호' autoFocus onChange={(e) => { setPassword(e.target.value); }} />
            <Form.Control id="confirm_password" className='mb-2' name="confirm_password" type="password" placeholder='비밀번호확인' autoFocus onChange={(e) => { setConfirmPassword(e.target.value); }} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <div className="d-grid gap-2 m-2">
        <Button disabled={!isVerified || !username || !password || password !== confirmPassword} variant="primary" onClick={()=>{ register(); }}>회원가입</Button>
        <Button variant="outline-dark" onClick={()=>{handleClose();showModal('signin');}}>이미 가입하셨다면?</Button>
      </div>
    </Modal>
  )

  function showModal(modalName) {
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }

  function confirmEmail() {
    apiAxios
      .put(`/api/auth/emailverification/signup`, { email, verifyToken })
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
    if (email.length === 0) {
      alert('이메일을 입력해야 합니다.');
      return;
    }
    setIsSending(true);
    apiAxios
      .post('/api/auth/emailverification/signup', { email })
      .then((response) => {
        const statusCode = response.status;
        console.log('status code: ' + statusCode);
        if (statusCode === 201) {
          setIsSending(false);
          alert(response.data.message);
        }
      })
      .catch((e) => {
        console.log('axios 통신실패');
        alert(e.response?.data.message);
      });
  }

  function register() {
    if (!isVerified) {
      alert('이메일 인증이 필요합니다.');
      return;
    }
    if (password !== confirmPassword) {
      alert('비밀번호가 비밀번호 확인과 다릅니다.')
      return;
    }
    apiAxios
      .post("/api/auth/signup", { email, username, password, verifyToken })
      .then((response) => {
        const statusCode = response.status;
        console.log("status code: " + statusCode);
        if (statusCode === 201) {
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

export default AuthSignupModal;