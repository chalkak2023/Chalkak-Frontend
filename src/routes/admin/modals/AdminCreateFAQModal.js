import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setShow } from "../../../store/modal.slice";
import apiAxios from "../../../utils/api-axios";

const AdminCreateFAQModal = ({done}) => {
  let [title, setTitle] = useState('');
  let [content, setContent] = useState('');

  const state = useSelector(state => state);
  const dispatch = useDispatch()

  const handleClose = () => dispatch(setShow(false))

  return (
    <Modal size="xl" show={state.modal.show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>자주찾는 질문 작성</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Text>제목</Form.Text>
          <Form.Control id="title" className='mb-2' name="title" type="text" autoFocus onChange={(e) => { setTitle(e.target.value); }}/>
          <Form.Text>내용</Form.Text>
          <Form.Control as="textarea" rows="15" id="content" className='mb-2' name="content" type="text" autoFocus onChange={(e) => { setContent(e.target.value); }}/>
        </Form>
      </Modal.Body>
      <Modal.Footer >
        <Button className="m-1" variant="outline-dark" onClick={handleClose}>취소</Button>
        <Button className="m-1" variant="primary" onClick={createFAQ}>작성</Button>
      </Modal.Footer>
    </Modal>
  )

  function createFAQ() {
    apiAxios
      .post(`/admin/faq`, {title, content})
      .then(({ status, data: body }) => {
        if (status === 201) {
          alert("작성");
          handleClose();
          done();
        }
      })
      .catch((e) => {
        console.log("axios 통신실패");
        alert(e.response.data.message);
      });
  }
  }
export default AdminCreateFAQModal