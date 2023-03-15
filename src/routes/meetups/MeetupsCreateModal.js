import { useDispatch, useSelector } from "react-redux";
import { setShow } from '../../store/modal.slice';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { useState } from "react";
import apiAxios from '../../utils/api-axios';

function MeetupsCreateModal(props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [place, setPlace] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [headcount, setHeadcount] = useState(0);
  const handleClose = () => dispatch(setShow(false));

  let state = useSelector((state)=> state );
  let dispatch = useDispatch();

  return (
    <Modal show={state.modal.show} dialogClassName="modal-90w" onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>같이 찍어요 등록</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control id="title" className='mb-2' type="text" placeholder='모임명' autoFocus onChange={(e) => { setTitle(e.target.value); }}/>
            <Form.Control id="content" className='mb-2' as="textarea" rows={2} placeholder='내용' onChange={(e) => { setContent(e.target.value); }}/>
            <Form.Control id="place" className='mb-2' type="text" placeholder='장소' onChange={(e) => { setPlace(e.target.value); }}/>
            <Form.Group className="mb-2">
              <Form.Label>약속날짜/시간</Form.Label>
              <InputGroup className="mb-2">
              <Form.Control id="scheduleDate" type="date" placeholder='날짜' onChange={(e) => { setScheduleDate(e.target.value); }}/>
              <Form.Control id="scheduleTime" type="time" placeholder='시간' onChange={(e) => { setScheduleTime(e.target.value); }}/>
              </InputGroup>
            </Form.Group>
            <Form.Control id="headcount" className='mb-2' type="number" placeholder='인원' onChange={(e) => { setHeadcount(e.target.value); }}/>
          </Form.Group>
        </Form>
        <Button variant="primary" onClick={()=>{ createMeetup(); }} style={{ width: '100%' }}>등록하기</Button>
      </Modal.Body>
    </Modal>
  )

  function createMeetup() {
    if (!inputValidator()) {
      return;
    }

    apiAxios
      .post('/api/meetups',
        {
          title, 
          content, 
          place, 
          schedule: `${scheduleDate} ${scheduleTime}`, 
          headcount
        },
        { withCredentials: true }
      )
      .then(({ status, data }) => {
        if (status === 201) {
          handleClose();
          window.location.reload();
        }
      })
      .catch(({ response }) => {
        console.log('axios 통신실패');
        const message = response.data.message;
        alert(message[message.length - 1]);
      });
  }

  function inputValidator() {
    if (title.length === 0) {
      alert('제목을 입력해주세요.');
      document.querySelector('#title').focus();
      return false;
    } else if (title.length > 12) {
      alert('제목은 12글자 이하로 입력해주세요.');
      document.querySelector('#title').focus();
      return false;
    } else if (content.length === 0) {
      alert('내용을 입력해주세요.');
      document.querySelector('#content').focus();
      return false;
    } else if (content.length > 200) {
      alert('내용은 200글자 이하로 입력해주세요.');
      document.querySelector('#content').focus();
      return false;
    } else if (place.length === 0) {
      alert('장소를 입력해주세요.');
      document.querySelector('#place').focus();
      return false;
    } else if (place.length > 8) {
      alert('장소는 8글자 이하로 입력해주세요.');
      document.querySelector('#place').focus();
      return false;
    } else if (scheduleDate.length === 0) {
      alert('날짜를 입력해주세요.');
      document.querySelector('#scheduleDate').focus();
      return false;
    } else if (scheduleTime.length === 0) {
      alert('시간을 입력해주세요.');
      document.querySelector('#scheduleTime').focus();
      return false;
    } else if (headcount === 0) {
      alert('정원을 입력해주세요.');
      document.querySelector('#headcount').focus();
      return false;;
    } 
    return true;
  }
}

export default MeetupsCreateModal;