import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Container, InputGroup, Form, Row, Col, Card, Stack } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setModalName, setShow } from '../../store/modal.slice';
import MeetupsCreateModal from './MeetupsCreateModal';

const MeetupsList = () => {
  const [meetups, setMeetups] = useState([]);
  let state = useSelector((state)=> state );
  let dispatch = useDispatch();

  useEffect(() => {
    getMeetups();
  }, []);

  return (
    <>
      { state.modal.modalName === 'create' && <MeetupsCreateModal /> }

      <Container>
        <div>
          <h2>같이 찍어요</h2>
          <InputGroup className="mb-5" style={{ width: '25rem' }}>
            <Form.Control type='text' placeholder='키워드를 검색해보세요.'/>
            <Button variant="outline-dark">검색</Button>
          </InputGroup>
        </div>

        <Stack direction="horizontal" gap={1} className="mb-2">
          <h2 >#전체 / 검색결과내용</h2>
          <Button className="ms-auto" variant="outline-dark">나의 모임</Button>
          <Button variant="outline-dark" onClick={()=>{showModal('create')}}>모임 추가</Button>
        </Stack>

        <Row xs={1} md={3} className="g-3">
          {meetups.map((meetup, i) => (
            <Col key={i}>
              <Card border="dark">
                <Card.Header>{meetup.title} ({meetup.joins.length}/{meetup.headcount})</Card.Header>
                <Card.Body style={{ height: '8rem' }}>
                  <Card.Title>{meetup.content}</Card.Title>
                  {/* <Card.Text>내용</Card.Text> */}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )

  function showModal(modalName){
    dispatch(setModalName(modalName));
    dispatch(setShow(true));
  }

  function getMeetups() {
    axios
      .get('http://localhost:8080/api/meetups', {})
      .then((response) => {
        const statusCode = response.status;
        console.log('status code: ' + statusCode);
        if (statusCode === 200) {
          const meetups = response.data;
          setMeetups(meetups);
        }
      })
      .catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      });
  }
}

export default MeetupsList;