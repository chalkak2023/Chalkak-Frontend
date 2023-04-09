import { useDispatch, useSelector } from "react-redux";
import { setShow } from '../../store/modal.slice';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import apiAxios from '../../utils/api-axios';

function MeetupsDetailModal(props) {
  const localeOptions = { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric' 
  };
  
  let state = useSelector((state)=> state );
  let dispatch = useDispatch();

  const handleClose = () => dispatch(setShow(false));

  return (
    <Modal size="sm" show={state.modal.show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{state.meetup.data.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>주최자: {state.meetup.data.user.username}</p>
        <p>{state.meetup.data.content}</p>
        <p>장소: {state.meetup.data.place}</p>
        <p>날짜시간: {new Date(state.meetup.data.schedule).toLocaleString('ko-KR', localeOptions)}</p>
        <OverlayTrigger
          placement="left"
          overlay={
            <Tooltip id="tooltip-left">
              { state.meetup.data.joins.map((join, i) => <div key={i}>{join.user.username}</div>) }
            </Tooltip>
          }
        >
          <Button variant="outline-dark mb-2" style={{ width: '100%' }}>
            참여인원: {state.meetup.data.joins.length}/{state.meetup.data.headcount}
          </Button>
        </OverlayTrigger>
        {getMeetupActionBtn()}        
      </Modal.Body>
    </Modal>
  )

  function addJoin() {
    const meetupId = state.meetup.data.id;
    apiAxios
      .post(`/api/meetups/${meetupId}/join`, {})
      .then(({ status }) => {
        if (status === 201) {
          props.getMeetupDetail(meetupId);
          props.resetMeetups();
        }
      })
      .catch(({ response }) => {
        console.log('axios 통신실패');
        const message = response.data.message;
        alert(message);
        props.getMeetupDetail(meetupId);
        props.resetMeetups();
      });
  }

  function deleteJoin() {
    const meetupId = state.meetup.data.id;
    apiAxios
      .delete(`/api/meetups/${meetupId}/join`)
      .then(({ status }) => {
        if (status === 200) {
          props.getMeetupDetail(meetupId);
          props.resetMeetups();
        }
      })
      .catch(({ response }) => {
        console.log('axios 통신실패');
        const message = response.data.message;
        alert(message);
        props.getMeetupDetail(meetupId);
        props.resetMeetups();
      });
  }

  function deleteMeetup() {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const meetupId = state.meetup.data.id;
      apiAxios
        .delete(`/api/meetups/${meetupId}`)
        .then(({ status }) => {
          if (status === 200) {
            handleClose();
            props.resetMeetups();
          }
        })
        .catch((e) => {
          console.log('axios 통신실패');
          console.log(e);
        });
    }
  }

  function closeMeetupAndSwitchToChat() {
    if (window.confirm('정말 모임의 모집을 마감하시겠습니까?')) {
      const meetupId = state.meetup.data.id;
      apiAxios
        .post(`/api/meetups/${meetupId}/chat`)
        .then(({ status }) => {
          if (status === 201) {
            handleClose();
            // props.getMeetupDetail(meetupId);
            props.resetMeetups();
            alert('성공적으로 모집 마감 되었습니다.\n채팅 메뉴에서 마감된 모임 참여 인원들과 채팅을 할 수 있습니다.');
          }
        })
        .catch((e) => {
          console.log('axios 통신실패');
          console.log(e);
        });
    }
  }

  function getMeetupActionBtn() {
    if (Object.keys(state.user.data).length === 0) {
      return;
    }
    if (state.user.data.id === state.meetup.data.userId) {
      return (
        <>
          <Button variant="outline-danger mb-2" onClick={()=>{deleteMeetup()}} style={{ width: '100%' }}>삭제하기</Button>
          <Button variant="outline-success" onClick={()=>{closeMeetupAndSwitchToChat()}} style={{ width: '100%' }}>모집마감</Button>
        </>
      )
    } else {
      const findResult = state.meetup.data.joins.find((join) => {
        return join.userId === state.user.data.id;
      });
      if (findResult) {
        return <Button variant="outline-danger" onClick={()=>{deleteJoin()}} style={{ width: '100%' }}>참여취소</Button>
      } else {
        if (state.meetup.data.joins.length === state.meetup.data.headcount) {
          return <Button variant="secondary" style={{ width: '100%' }}>모집마감</Button>
        }
        return <Button variant="outline-success" onClick={()=>{addJoin()}} style={{ width: '100%' }}>참여하기</Button>
      }
    }
  }
}

export default MeetupsDetailModal;