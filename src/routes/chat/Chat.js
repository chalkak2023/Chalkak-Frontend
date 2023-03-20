import { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setIsFooterOn } from '../../store/footer.slice';
import './Chat.css';

const ChatContainer = () => {
  const [meetups, setMeetups] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [temp, setTemp] = useState([1, 2, 3]);

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(setIsFooterOn(false));
    return () => dispatch(setIsFooterOn(true));
  }, []);

  return (
    <>
      <Container className='chat_container'>
        {/* 왼쪽 모임 목록 섹션 시작 */}
        <div className="meetups_box">
          <h5 className="meetups_box_header">같이찍어요 채팅 목록</h5>
          <div className="meetups_box_body">
            {
              meetups.map((x, i) => 
                // <div className="meetups_box_body_item active" key={i}>
                <div className="meetups_box_body_item" key={i}>
                  <h5>모임 제목 <span>2023년 3월 20일</span></h5>
                  <p>모임 내용</p>
                  <Button className="chatExitBtn" variant="danger" size="sm" style={{ float: 'right' }} onClick={()=>{exitChat()}}>나가기</Button>
                </div>
              )
            }
          </div>
        </div>
        {/* 왼쪽 모임 목록 섹션 끝 */}

        {/* 오른쪽 채팅 섹션 시작 */}
        <div className="chat_box">
          <div className="chat_history">
            {
              temp.map((x, i) => 
                <>
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
                </>
              )
            }
          </div>

          <div className="write_msg">
            <input type="text" placeholder="메시지를 입력하세요" />
            <Button className="chatSendBtn" size="sm" onClick={sendMsg}>보내기</Button>
          </div>
        </div>
        {/* 오른쪽 채팅 섹션 끝 */}
      </Container>
    </>
  )

  function exitChat() {
    alert('준비중');
  }

  function sendMsg() {
    alert('준비중');
  }
};

export default ChatContainer;
