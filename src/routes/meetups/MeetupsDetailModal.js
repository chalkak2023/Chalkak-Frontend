// import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setShow } from '../../store/modal.slice';
import { Button, Modal } from 'react-bootstrap';

function MeetupsDetailModal() {
  const handleClose = () => dispatch(setShow(false));

  let state = useSelector((state)=> state );
  let dispatch = useDispatch();

  return (
    <Modal size="sm" show={state.modal.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{state.meetup.data.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{state.meetup.data.content}</p>
        <p>장소: {state.meetup.data.place}</p>
        <p>날짜/시간: {new Date(state.meetup.data.schedule).toLocaleString()}</p>
        <p>참여인원: {state.meetup.data.joins.length}/{state.meetup.data.headcount}</p>
        {getMeetupActionBtn()}        
      </Modal.Body>
    </Modal>
  )

  function getMeetupActionBtn() {
    if (Object.keys(state.user.data).length === 0) {
      return;
    }
    if (state.user.data.id === state.meetup.data.userId) {
      return <Button variant="outline-danger" style={{ width: '100%' }}>삭제하기</Button>
    } else {
      const findResult = state.meetup.data.joins.find((join) => {
        return join.userId === state.user.data.id;
      });
      if (findResult) {
        return <Button variant="outline-danger" style={{ width: '100%' }}>참여취소</Button>
      } else {
        return <Button variant="outline-success" style={{ width: '100%' }}>참여하기</Button>
      }
    }
  }
}

export default MeetupsDetailModal;