import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Button, Container, InputGroup, Form, Row, Col, Card, Stack } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import MeetupsCreateModal from './MeetupsCreateModal';
import MeetupsDetailModal from './MeetupsDetailModal';
import { setModalName, setShow } from '../../store/modal.slice';
import { setMeetup } from '../../store/meetup.slice';
import Loading from '../components/loading/Loading';

const MeetupsList = () => {
  let state = useSelector((state)=> state );
  let dispatch = useDispatch();

  const [meetups, setMeetups] = useState([]);
  const target = useRef(null);
  const page = useRef(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    observer.observe(target.current);
    return () => observer.disconnect();
  }, []);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (loading) return;

      getMeetups(page.current);
      page.current += 1;
    });
  });

  return (
    <>
      { loading && <Loading /> }

      { state.modal.modalName === 'create' && <MeetupsCreateModal getMeetups={getMeetups}/> }
      { state.modal.modalName === 'detail' && 
        <MeetupsDetailModal 
          showDetail={showDetail} 
        /> 
      }

      <Container>
        <div>
          <h2 onClick={()=>{window.location.reload()}} style={{ cursor: 'pointer' }}>같이 찍어요</h2>
          <InputGroup className="mb-5" style={{ width: '25rem' }}>
            <Form.Control type='text' placeholder='키워드를 검색해보세요.'/>
            <Button variant="outline-dark">검색</Button>
          </InputGroup>
        </div>

        <Stack direction="horizontal" gap={1} className="mb-2">
          <h2 >#전체 / 검색결과내용</h2>
          {
            Object.keys(state.user.data).length > 0 ?
            <>
              <Button className="ms-auto" variant="outline-dark">나의 모임</Button>
              <Button variant="outline-dark" onClick={()=>{showModal('create')}}>모임 추가</Button>
            </> : ''
          }
          
        </Stack>

        <Row xs={1} md={3} className="g-3 mb-3">
          {meetups.map((meetup, i) => (
            <Col key={i} onClick={()=>{showDetail(meetup.id)}} style={{ cursor: 'pointer' }}>
              <Card border="dark">
                <Card.Header>{meetup.title} ({meetup.joins.length}/{meetup.headcount})</Card.Header>
                <Card.Body style={{ height: '8rem' }}>
                  <Card.Text>주최자: {meetup.user.username}</Card.Text>
                  <Card.Title>{meetup.content}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div id="scrollEnd" style={{ height: "1px" }} ref={target}></div>
      </Container>
    </>
  )

  function getMeetups(p) {
    setLoading(true);
    console.log('p: ', p);
    axios
      .get(`http://localhost:8080/api/meetups?p=${p}`)
      .then(({ status, data }) => {
        if (status === 200) {
          const newMeetups = data;
          if (newMeetups.length === 0) {
            console.log('더 불러올 데이터가 없습니다.');
            document.querySelector('#scrollEnd').hidden = true;
          } else {
            setMeetups((prev) => [...prev, ...newMeetups]);
          }
        }
      }).catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      }).finally(() => {
        setLoading(false);
      })
  }

  function showDetail(meetupId) {
    axios
      .get(`http://localhost:8080/api/meetups/${meetupId}`)
      .then((response) => {
        if (response.status === 200) {
          const meetup = response.data;
          dispatch(setMeetup(meetup));
          dispatch(setModalName('detail'));
          dispatch(setShow(true));
        }
      })
      .catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      });
  }

  function showModal(modalName) {
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }
}

export default MeetupsList;