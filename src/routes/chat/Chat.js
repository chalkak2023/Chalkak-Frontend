import './Chat.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setIsFooterOn } from '../../store/footer.slice';
import { io } from 'socket.io-client';
import apiAxios from '../../utils/api-axios';

const socket = io(`${process.env.REACT_APP_SERVER_ADDRESS}/chat`);
const ChatContainer = () => {
  const [meetups, setMeetups] = useState([]);
  const [temp, setTemp] = useState([1, 2, 3]);

  const [chats, setChats] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerEl = useRef(null);

  let dispatch = useDispatch();

  useEffect(() => {
    // footer 제거
    dispatch(setIsFooterOn(false));

    // 채팅방 목록 세팅
    getMeetups();

    // socket.io 메시지 핸들러 세팅
    const messageHandler = (chat) => {
      console.log('서버로부터 메시지 받음');
      console.log(`test: `);
      console.log(chat);

      setChats((prevChats) => [...prevChats, chat]);
    }
    socket.on('message', messageHandler);
    
    return () => {
      dispatch(setIsFooterOn(true));
      socket.off('message', messageHandler);
    };
  }, []);

  // 스크롤 제어
  useEffect(() => {
    if (!chatContainerEl.current) return;

    const chatContainer = chatContainerEl.current;
    const { scrollHeight, clientHeight } = chatContainer;

    if (scrollHeight > clientHeight) {
      chatContainer.scrollTop = scrollHeight - clientHeight;
    }
  }, [chats.length]);

  const onChange = useCallback((e) => {
    setInputMessage(e.target.value);
  }, []);

  const onSendMessage = useCallback((e) => {
    if (!inputMessage) return alert('메시지를 입력해 주세요.');

    socket.emit('message', inputMessage, (chat) => {
      console.log('서버로 메시지 보냄');
      setChats((prevChats) => [...prevChats, chat]);
      setInputMessage('');
    });
  }, [inputMessage]);

  return (
    <>
      <Container className='chat_container' ref={chatContainerEl}>
        {/* 왼쪽 모임 목록 섹션 시작 */}
        <div className="meetups_box">
          <h5 className="meetups_box_header">같이찍어요 채팅 목록</h5>
          <div className="meetups_box_body">
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
          <div className="chat_history">
            { temp.map((x, i) => (
              <div key={i}>
                <div className="incoming_msg">
                  <div className='incoming_msg_writer'>닉네임1닉네임1: </div>
                  <div className="incoming_msg_content">
                    <p>테스트 채팅 1</p>
                    <span className="msg_date">11:01 AM | 3월 20일</span>
                  </div>
                </div>

                <div className="outgoing_msg">
                  <div className="outgoing_msg_content">
                    <p>테스트 채팅 2. 길게 보내면 어떻게 될까 테스트</p>
                    <span className="msg_date">11:01 AM | 3월 20일</span>
                  </div>
                </div>
              </div>
            )) }
          </div>

          <div className="write_msg">
            <input type="text" placeholder="메시지를 입력하세요" onChange={onChange} value={inputMessage} />
            <Button className="chatSendBtn" size="sm" onClick={onSendMessage}>보내기</Button>
          </div>
        </div>
        {/* 오른쪽 채팅 섹션 끝 */}
      </Container>
    </>
  )

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
