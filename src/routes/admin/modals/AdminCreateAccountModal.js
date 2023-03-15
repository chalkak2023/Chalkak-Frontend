import { useState } from "react";
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { setShow } from '../../../store/modal.slice';
import apiAxios from "../../../utils/api-axios";

function AdminCreateAccountModal({done}) {
  let [account, setAccount] = useState('');
  let [responsibility, setResponsibility] = useState('');
  let [password, setPassword] = useState('');
  let [confirmPassword, setConfirmPassword] = useState('');

  const state = useSelector((state)=> state);
  const dispatch = useDispatch();

  const handleClose = () => dispatch(setShow(false));

  return (
    <Modal size="sm" show={state.modal.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>관리자 추가</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control id="account" className='mb-2' name="account" type="email" placeholder='계정명' autoFocus onChange={(e) => { setAccount(e.target.value); }}/>
            <Form.Control id="resposibility" className='mb-2' name="resposibility" type="text" placeholder='이름' autoFocus onChange={(e) => { setResponsibility(e.target.value); }}/>
            <Form.Control id="password" className='mb-2' name="password" type="password" placeholder='비밀번호' autoFocus onChange={(e) => { setPassword(e.target.value); }} />
            <Form.Control id="confirm_password" className='mb-2' name="confirm_password" type="password" placeholder='비밀번호확인' autoFocus onChange={(e) => { setConfirmPassword(e.target.value); }} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <div className="d-grid gap-2 m-2">
        <Button variant="primary" onClick={()=>{ register(); }}>회원가입</Button>
      </div>
    </Modal>
  )

  function register() {
    if (password !== confirmPassword) {
      alert('비밀번호가 비밀번호 확인과 다릅니다.')
      return;
    }
    apiAxios
      .post("/admin/auth/signup", { account, password, responsibility })
      .then(({status, data}) => {
        if (status === 201) {
          alert("관리자를 추가했습니다.");
          handleClose()
          done()
        }
      })
      .catch((e) => {
        if (e.response) {
          alert('관리자를 추가하지 못 했습니다.')
        }
        console.log(e)
      });
  }
}

export default AdminCreateAccountModal;