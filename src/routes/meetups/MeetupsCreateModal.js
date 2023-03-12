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
            <Form.Control className='mb-2' type="text" placeholder='모임명' autoFocus onChange={(e) => { setTitle(e.target.value); }}/>
            <Form.Control className='mb-2' as="textarea" rows={2} placeholder='내용' onChange={(e) => { setContent(e.target.value); }}/>
            <Form.Control className='mb-2' type="text" placeholder='장소' onChange={(e) => { setPlace(e.target.value); }}/>
            <Form.Group className="mb-2">
              <Form.Label>약속날짜/시간</Form.Label>
              <InputGroup className="mb-2">
              <Form.Control type="date" placeholder='날짜' onChange={(e) => { setScheduleDate(e.target.value); }}/>
              <Form.Control type="time" placeholder='시간' onChange={(e) => { setScheduleTime(e.target.value); }}/>
              </InputGroup>
            </Form.Group>
            <Form.Control className='mb-2' type="number" placeholder='인원' onChange={(e) => { setHeadcount(e.target.value); }}/>
          </Form.Group>
        </Form>
        <Button variant="primary" onClick={()=>{ createMeetup(); }} style={{ width: '100%' }}>등록하기</Button>
      </Modal.Body>
    </Modal>
  )

  function createMeetup() {
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
      .then((response) => {
        const statusCode = response.status;
        // console.log('status code: ' + statusCode);
        if (statusCode === 201) {
          handleClose();
          window.location.reload();
        }
      })
      .catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      });
  }
}

export default MeetupsCreateModal;