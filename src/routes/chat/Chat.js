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
                <div className="meetups_box_body_item" key={i} onClick={selectMeetup}>
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
            { chats.map((chat, i) => {
                if ('msgObj' in chat) {
                  const msgObj = chat.msgObj;
                  if (msgObj.userId === state.user.data.id) {
                    return (
                      <div className="outgoing_msg" key={i}>
                        <div className="outgoing_msg_content">
                          <p>{msgObj.message}</p>
                          <span className="msg_date">{new Date(msgObj.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div className="incoming_msg" key={i}>
                        <div className='incoming_msg_writer'>{msgObj.username}: </div>
                        <div className="incoming_msg_content">
                          <p>{msgObj.message}</p>
                          <span className="msg_date">{new Date(msgObj.createdAt).toLocaleString()}</span>
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
            }) }
          </div>
          {/* 채팅창 끝 */}

          <div className="write_msg">
            <input type="text" placeholder="메시지를 입력하세요" 
              value={inputMessage} 
              onChange={(e)=>{setInputMessage(e.target.value);}} 
              // onKeyUp={pressEnterHandler}
            />
            <Button className="chatSendBtn" size="sm" onClick={onSendMessage}>보내기</Button>
          </div>
        </div>
        {/* 오른쪽 채팅 섹션 끝 */}
      </Container>
    </>
  )

  // 엔터 입력 시 두 번 실행되는 문제로 일단 보류
  // function pressEnterHandler(e) {
  //   if (e.key === "Enter") {
  //     onSendMessage();
  //   }
  // }

  function onSendMessage() {
    if (!inputMessage) {
      return alert('메시지를 입력해 주세요.');
    } else {
      const msgObj = {
        userId: state.user.data.id,
        username: state.user.data.username,
        message: inputMessage,
        createdAt: new Date()
      }
      socket.emit('message', msgObj, (chat) => {
        console.log('메시지 보냄');
        setChats((prevChats) => [...prevChats, chat]);
        setInputMessage('');
      });
    }
  };

  function selectMeetup(e) {
    const clickedItem = e.currentTarget;
    const items = document.querySelectorAll('.meetups_box_body_item');
    items.forEach(item => {
      if (item !== clickedItem) {
        item.classList.remove('active');
      }
    });
    clickedItem.classList.add('active');
  }

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
    alert('준비중');
  }
};

export default ChatContainer;
