import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setShow } from "../../../store/modal.slice";
import apiAxios from "../../../utils/api-axios";

const AdminCreateFAQModal = ({changeList, prev}) => {
  let [title, setTitle] = useState('');
  let [content, setContent] = useState('');

  const state = useSelector(state => state);
  const dispatch = useDispatch()

  useEffect(() => {
    if (prev.title && prev.content) {
      setTitle(prev.title);
      setContent(prev.content);
    }
  } ,[prev])

  const handleClose = () => dispatch(setShow(false))

  return (
    <Modal size="xl" show={state.modal.show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>자주찾는 질문 수정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Text>제목</Form.Text>
          <Form.Control id="title" className='mb-2' name="title" type="text" value={title} autoFocus onChange={(e) => { setTitle(e.target.value); }}/>
          <Form.Text>내용</Form.Text>
          <Form.Control as="textarea" rows="15" id="content" className='mb-2' name="content" value={content} type="text" autoFocus onChange={(e) => { setContent(e.target.value); }}/>
        </Form>
      </Modal.Body>
      <Modal.Footer >
        <Button className="m-1" variant="outline-dark" onClick={handleClose}>취소</Button>
        <Button className="m-1" variant="outline-danger" onClick={removeFAQ}>삭제</Button>
        <Button className="m-1" variant="primary" onClick={putFAQ}>수정</Button>
      </Modal.Footer>
    </Modal>
  )

  
  function removeFAQ() {
    apiAxios
      .delete(`/admin/faq/${prev.id}`)
      .then(({ status, data: body }) => {
        if (status === 200) {
          alert("삭제 완료");
          handleClose();
          changeList();
        }
      })
      .catch((e) => {
        console.log("axios 통신실패");
        alert(e.response.data.message);
      });
  }

  function putFAQ() {
    apiAxios
      .put(`/admin/faq/${prev.id}`, {title, content})
      .then(({ status, data: body }) => {
        if (status === 200) {
          alert('자주찾는질문을 수정했습니다.')
          handleClose();
          changeList();
        }
      })
      .catch((e) => {
        if (e.response) {
          alert('자주찾는질문을 수정하지 못했습니다.')
        }
        console.log(e)
      });
  }
}

export default AdminCreateFAQModal