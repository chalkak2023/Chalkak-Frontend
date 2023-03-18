import { useEffect, useState } from "react";
import { Row, Col, Card, Container, Stack, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import apiAxios from '../../utils/api-axios';

const MainMeetups = () => {
  const [meetups, setMeetups] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    getMeetups();
  }, []);

  return (
    <>
      <Container style={{ marginBottom: '100px'}}>
        <Stack direction="horizontal" gap={1} className="mb-2">
          <h2>최근 생성된 모임</h2>
          <Button className="ms-auto ChalkakBtn" variant="outline-dark" onClick={() => {navigate('/meetups');}}>보러가기</Button>
        </Stack>
        <Row xs={1} md={3} className="g-4 mb-3">
          {
            meetups.length > 0 ?
            meetups.map((meetup, i) => (
              <Col key={i}>
                <Card border="dark">
                  <Card.Header>{meetup.title} ({meetup.joins.length}/{meetup.headcount})</Card.Header>
                  <Card.Body style={{ height: '8rem' }}>
                  <Card.Text>주최자: {meetup.user.username}</Card.Text>
                    <Card.Title className='meetupContent'>{meetup.content}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            )) :
            <h3>데이터가 없습니다.</h3>
          }
        </Row>
      </Container>
    </>
  )

  function getMeetups() {
    apiAxios
      .get(`/api/meetups?p=1`)
      .then(({ status, data }) => {
        if (status === 200) {
          let tempArr = [];
          if (data.length < 3) {
            for (let i = 0; i < data.length; i++ ) {
              tempArr.push(data[i]);
            }
          } else {
            for (let i = 0; i < 3; i++ ) {
              tempArr.push(data[i]);
            }
          }
          setMeetups(tempArr);
        }
      }).catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      });
  }
};

export default MainMeetups;
