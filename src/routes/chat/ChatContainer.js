import { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setIsFooterOn } from '../../store/footer.slice';
import './Chat.css';

const ChatContainer = () => {
  const [meetups, setMeetups] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
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

          {/* 모임 목록 헤더 시작 */}
          <div className="meetups_box_header">
            <div className="recent_heading">
              <h4>같이찍어요 채팅 목록</h4>
            </div>

            {/* 검색 기능 시작 */}
            {/* <div className="srch_bar">
              <div className="stylish-input-group">
                <input type="text" className="search-bar" placeholder="Search" />
                <span className="input-group-addon">
                  <button type="button">
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </button>
                </span>
              </div>
            </div> */}
            {/* 검색 기능 끝 */}

          </div>
          {/* 모임 목록 헤더 끝 */}

          {/* 모임 목록 바디 시작 */}
          <div className="meetups_box_body">
            {
              meetups.map((x, i) => 
                // <div className="chat_list active_chat" key={i}>
                <div className="chat_item" key={i}>
                  <h5>모임 제목 <span>2023년 3월 20일</span></h5>
                  <p>모임 내용</p>
                  <Button className="chatExitBtn" variant="danger" size="sm" style={{ float: 'right' }}>나가기</Button>
                </div>
              )
            }
          </div>
          {/* 모임 목록 바디 끝 */}

        </div>
        {/* 왼쪽 모임 목록 섹션 끝 */}

        {/* 오른쪽 채팅 섹션 시작 */}
        <div className="chat_box">

          <div className="msg_history">

            {/* 상대 메시지 시작 */}
            <div className="incoming_msg">
              <div className='writer'>닉네임1닉네임1: </div>
              <div className="incoming_msg_img">
                {/* <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> */}
                {/* <Button size="sm" >보내기</Button> */}
                {/* <p>닉네임1</p> */}
              </div>
              <div className="received_msg">
                <div className="received_withd_msg">
                  <p>테스트 채팅 1</p>
                  <span className="msg_date">11:01 AM | 3월 20일</span>
                </div>
              </div>
            </div>
            {/* 상대 메시지 끝 */}

            {/* 내 메시지 시작 */}
            <div className="outgoing_msg">
              <div className="sent_msg">
                <p>테스트 채팅 2. 길게 보내면 어떻게 될까 테스트</p>
                <span className="msg_date">11:01 AM | 3월 20일</span>
              </div>
            </div>
            {/* 내 메시지 끝 */}

          </div>

          {/* 메시지 입력 섹션 시작 */}
          <div className="type_msg">
            <div className="input_msg_write">
              <input type="text" className="write_msg" placeholder="메시지를 입력하세요" />
              <Button className="chatSendBtn" size="sm" >보내기</Button>
            </div>
          </div>
          {/* 메시지 입력 섹션 끝 */}


        </div>
        {/* 오른쪽 채팅 섹션 끝 */}

      </Container>
    </>
  )
};

export default ChatContainer;
