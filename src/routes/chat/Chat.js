import './Chat.css';
import { useEffect, useRef, useState } from 'react';
import { Container, Button, OverlayTrigger, Tooltip, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setIsFooterOn } from '../../store/footer.slice';
import { io } from 'socket.io-client';
import apiAxios from '../../utils/api-axios';
import { useNavigate } from 'react-router-dom';

const socket = io(`${process.env.REACT_APP_SERVER_ADDRESS}/chat`);
const ChatContainer = () => {
  const [meetups, setMeetups] = useState([]);
  const [chats, setChats] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(-1);
  const [numberOfSelectedRoom, setNumberOfSelectedRoom] = useState(0);
  const chatContainerEl = useRef(null);
  const localeOptions = { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric' 
  };

  let state = useSelector((state)=> state );
  let dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(state.user.data).length === 0) {
      alert('잘못된 접근입니다.');
      return navigate('/');
    } else {
      // footer 제거
      dispatch(setIsFooterOn(false));
  
      // 채팅방 목록 세팅
      getMeetups();
    }
    
    // socket.io 메시지 핸들러 세팅
    const messageHandler = (chat) => {
      setChats((prevChats) => [...prevChats, chat]);
    }
    const alertHandler = (chat, num) => {
      const targetUsername = chat.message.split('님')[0];
      if (targetUsername !== state.user.data.username) {
        setChats((prevChats) => [...prevChats, chat]);
      }
      setNumberOfSelectedRoom(num);
    }
    socket.on('message', messageHandler);
    socket.on('alert', alertHandler);
    
    return () => {
      dispatch(setIsFooterOn(true));
      leaveRoom(selectedRoom);
      socket.off('message', messageHandler);
      socket.off('alert', alertHandler);
    };
  }, []);

  // 스크롤 제어 - 최신 메시지 따라 밑으로
  useEffect(() => {
    if (!chatContainerEl.current) return;

    const chatContainer = chatContainerEl.current;
    const { scrollHeight, clientHeight } = chatContainer;

    if (scrollHeight > clientHeight) {
      chatContainer.scrollTop = scrollHeight - clientHeight;
    }
  }, [chats.length]);

  return (
    <>
      <Container className='chat_container'>
        {/* 왼쪽 모임 목록 섹션 시작 */}
        <div className="meetups_box">
          <h5 className="meetups_box_header">같이찍어요 채팅 목록</h5>
          <div className="meetups_box_body">
            {/* 채팅방 목록 */}
            {
              meetups.length > 0 ?
              meetups.map((meetup, i) => (
                <div className="meetups_box_body_item" key={i} onClick={(e) => {selectRoom(e, meetup.id)}}>
                  <h5>{meetup.title} <span>약속시간: {new Date(meetup.schedule).toLocaleString('ko-KR', localeOptions)}</span></h5>
                  <p>{meetup.content}</p>
                  <Row className="me-1" style={{ width: '70px', float: 'right' }}>
                    <OverlayTrigger
                      placement="left"
                      overlay={
                        <Tooltip id="tooltip-left">
                          { meetup.joins.map((join, i) => <div key={i}>{join.user.username}</div>) }
                        </Tooltip>
                      }
                    >
                      <Button variant="outline-dark" size="sm">멤버</Button>
                    </OverlayTrigger>
                    <Button className="chatExitBtn" variant="danger" size="sm" onClick={(e)=>{exitChat(e, meetup.id)}}>나가기</Button>
                  </Row>
                </div>
              )) : 
              <div className="meetups_box_body_item">
                <h5>참여한 함께찍어요 모임이 모집 마감되면<br/>모임 참여 인원들과 여기서 채팅하실 수 있습니다.</h5>
              </div>
            }
          </div>
        </div>
        {/* 왼쪽 모임 목록 섹션 끝 */}

        {/* 오른쪽 채팅 섹션 시작 */}
        <div className="chat_box">
          { selectedRoom > -1 ?
            <p className="chat_header">접속인원: {numberOfSelectedRoom}</p> : 
            <p className="chat_header">채팅방을 선택해주세요.</p>
          }
          {/* 채팅창 시작 */}
          <div className="chat_history" ref={chatContainerEl}>
            { selectedRoom > -1 ?
              chats.map((chatObj, i) => {
                if (chatObj.userId !== 0) {
                  if (chatObj.userId === state.user.data.id) {
                    return (
                      <div className="outgoing_msg" key={i}>
                        <div className="outgoing_msg_content">
                          <p>{chatObj.message}</p>
                          <span className="msg_date">{new Date(chatObj.createdAt).toLocaleString('ko-KR', localeOptions)}</span>
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div className="incoming_msg" key={i}>
                        <div className='incoming_msg_writer'>{chatObj.username}: </div>
                        <div className="incoming_msg_content">
                          <p>{chatObj.message}</p>
                          <span className="msg_date">{new Date(chatObj.createdAt).toLocaleString('ko-KR', localeOptions)}</span>
                        </div>
                      </div>
                    )
                  }
                } else if (chatObj.userId === 0) {
                  return (
                    <div className="alert_msg" key={i}>
                      <div className="alert_msg_content">
                        <p>{chatObj.message}</p>
                      </div>
                    </div>
                  )
                }
              }) : ''
            }
          </div>
          {/* 채팅창 끝 */}

          <div className="write_msg">
            <input type="text" placeholder="메시지를 입력하세요" 
              value={inputMessage} 
              onChange={(e)=>{setInputMessage(e.target.value);}} 
              onKeyDown={(e)=>pressEnterHandler(e)}
              disabled={selectedRoom < 0}
            />
            <Button className="chatSendBtn" size="sm" onClick={sendMessage} disabled={selectedRoom < 0}>보내기</Button>
          </div>
        </div>
        {/* 오른쪽 채팅 섹션 끝 */}
      </Container>
    </>
  )

  function pressEnterHandler(e) {
    if (e.isComposing || e.keyCode === 229) return; 
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  function sendMessage() {
    if (!inputMessage) {
      return alert('메시지를 입력해 주세요.');
    }
    if (selectedRoom < 0) {
      return alert('채팅방을 선택해야 합니다.');
    }
    const chatObj = {
      roomId: selectedRoom,
      userId: state.user.data.id,
      username: state.user.data.username,
      message: inputMessage,
      createdAt: new Date()
    }
    socket.emit('message', chatObj, (chat) => {
      setChats((prevChats) => [...prevChats, chat]);
      setInputMessage('');
    });
  };

  async function selectRoom(e, meetupId) {
    if (meetupId === selectedRoom) {
      return console.log('이미 접속한 채팅방입니다.');
    }
    const clickedItem = e.currentTarget;
    // 접속해있던 채팅방 퇴장
    const items = document.querySelectorAll('.meetups_box_body_item');
    items.forEach(item => {
      if (item !== clickedItem) {
        item.classList.remove('active');
      }
    });
    if (selectedRoom > -1 && selectedRoom !== meetupId) {
      leaveRoom(selectedRoom);
    }

    // 선택한 채팅방 채팅 가져오기
    await getChats(meetupId);

    // 선택한 채팅방 접속
    clickedItem.classList.add('active');
    setSelectedRoom(meetupId);
    joinRoom(meetupId);
  }

  async function getChats(roomId) {
    apiAxios
    .get(`/api/chats/${roomId}`)
    .then(({ status, data }) => {
      if (status === 200) {
        setChats(data);
      }
    }).catch((e) => {
      console.log('axios 통신실패');
      console.log(e);
    });
  }

  function joinRoom(roomId) {
    const chatObj = {
      roomId,
      userId: state.user.data.id,
      username: state.user.data.username,
    }
    socket.emit('join-room', chatObj, (res) => {
      if (!res.success) {
        alert(`채팅방 접속 불가!`);
        return console.log(`채팅방 접속 불가! :: ${res.payload}`);
      }
    });
  }

  function leaveRoom(roomId) {
    let result = true;
    const chatObj = {
      roomId,
      userId: state.user.data.id,
      username: state.user.data.username,
    }
    socket.emit('leave-room', chatObj, (res) => {
      if (!res.success) {
        result = false;
        console.log(`채팅방 퇴장 오류`);
      }
    });
    return result;
  };

  function getMeetups() {
    apiAxios
      .get(`/api/chats`)
      .then(({ status, data }) => {
        if (status === 200) {
          setMeetups(data);
        }
      }).catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      });
  }

  function exitChat(e, chatId) {
    e.stopPropagation();

    if (window.confirm(`정말 나가시겠습니까?\n나가면 채팅방에 다시 들어올 수 없습니다.`)) {
      if (!leaveRoom(chatId)) {
        return console.log('채팅방 퇴장 오류로 인한 완전 퇴장 중단');
      }
      apiAxios
      .delete(`/api/chats/${chatId}`)
      .then(({ status }) => {
        if (status === 200) {
          // 선택된 채팅방 초기화
          setSelectedRoom(-1);
          // 선택된 채팅창 접속자 수 초기화
          setNumberOfSelectedRoom(0);
          // 채팅 초기화
          setChats([]);
          // 채팅방 목록 초기화
          getMeetups();
          // 선택된 채팅방 css 초기화
          const items = document.querySelectorAll('.meetups_box_body_item');
          items.forEach(item => {
            item.classList.remove('active');
          });
        }
      })
      .catch((err) => {
        console.log('axios 통신실패');
        console.log(err);
      });
    }
  }
};

export default ChatContainer;
