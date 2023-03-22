import './Chat.css';
import { useEffect, useRef, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setIsFooterOn } from '../../store/footer.slice';
import { io } from 'socket.io-client';
import apiAxios from '../../utils/api-axios';

const socket = io(`${process.env.REACT_APP_SERVER_ADDRESS}/chat`);
const ChatContainer = () => {
  const [meetups, setMeetups] = useState([]);
  const [chats, setChats] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(-1);
  const chatContainerEl = useRef(null);

  let state = useSelector((state)=> state );
  let dispatch = useDispatch();

  useEffect(() => {
    // footer 제거
    dispatch(setIsFooterOn(false));

    // 채팅방 목록 세팅
    getMeetups();

    // socket.io 메시지 핸들러 세팅
    const messageHandler = (chat) => {
      setChats((prevChats) => [...prevChats, chat]);
    }
    const alertHandler = (chat) => {
      setChats((prevChats) => [...prevChats, chat]);
    }
    socket.on('message', messageHandler);
    socket.on('alert', alertHandler);
    
    return () => {
      dispatch(setIsFooterOn(true));
      socket.off('message', messageHandler);
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
                  <h5>{meetup.title} <span>약속시간: {new Date(meetup.schedule).toLocaleString()}</span></h5>
                  <p>{meetup.content}</p>
                  <Button className="chatExitBtn" variant="danger" size="sm" style={{ float: 'right' }} onClick={()=>{exitChat()}}>나가기</Button>
                </div>
              )) : ''
            }
          </div>
        </div>
        {/* 왼쪽 모임 목록 섹션 끝 */}

        {/* 오른쪽 채팅 섹션 시작 */}
        <div className="chat_box">

          {/* 채팅창 시작 */}
          <div className="chat_history" ref={chatContainerEl}>
            { selectedRoom > -1 ?
              chats.map((chat, i) => {
                if ('chatObj' in chat) {
                  const chatObj = chat.chatObj;
                  if (chatObj.userId === state.user.data.id) {
                    return (
                      <div className="outgoing_msg" key={i}>
                        <div className="outgoing_msg_content">
                          <p>{chatObj.message}</p>
                          <span className="msg_date">{new Date(chatObj.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div className="incoming_msg" key={i}>
                        <div className='incoming_msg_writer'>{chatObj.username}: </div>
                        <div className="incoming_msg_content">
                          <p>{chatObj.message}</p>
                          <span className="msg_date">{new Date(chatObj.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    )
                  }
                } else if ('alert' in chat) {
                  const alert = chat.alert;
                  return (
                    <div className="alert_msg" key={i}>
                      <div className="alert_msg_content">
                        <p>{alert.message}</p>
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
              // onKeyUp={pressEnterHandler}
              disabled={selectedRoom < 0}
            />
            <Button className="chatSendBtn" size="sm" onClick={sendMessage} disabled={selectedRoom < 0}>보내기</Button>
          </div>
        </div>
        {/* 오른쪽 채팅 섹션 끝 */}
      </Container>
    </>
  )

  // 엔터 입력 시 두 번 실행되는 문제로 일단 보류
  // function pressEnterHandler(e) {
  //   if (e.key === "Enter") {
  //     sendMessage();
  //   }
  // }

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

  function selectRoom(e, meetupId) {
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

    // 선택한 채팅방 접속
    clickedItem.classList.add('active');
    setSelectedRoom(meetupId);
    joinRoom(meetupId);

    // 채팅창 초기화
    setChats([]);
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
    const chatObj = {
      roomId,
      userId: state.user.data.id,
      username: state.user.data.username,
    }
    socket.emit('leave-room', chatObj, (res) => {
      if (!res.success) {
        return console.log(`채팅방 퇴장 오류`);
      }
    });
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

  function exitChat() {
    setSelectedRoom(-1);
    setChats([]);
    if (window.confirm(`정말 나가시겠습니까?\n나가면 채팅방에 다시 들어올 수 없습니다.`)) {
      alert('준비중');
    }
  }
};

export default ChatContainer;
