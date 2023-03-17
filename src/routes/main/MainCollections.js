import { useEffect, useState } from "react";
import { Row, Col, Card, Container, Stack, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import apiAxios from '../../utils/api-axios';

const MainCollections = () => {
  const [collections, setCollections] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <>
      <Container className="mb-2">
        <Stack direction="horizontal" gap={1} className="mb-2">
          <h2>최근 생성된 콜렉션</h2>
          <Button className="ms-auto" variant="outline-dark" onClick={() => {navigate('/collections');}}>보러가기</Button>
        </Stack>
        <Row xs={1} md={3} className="g-3 mb-3">
          {
            collections.length > 0 ?
            collections.map((collection, i) => (
              <Col key={i}>
                <Card border="dark">
                    <Card.Header>{collection.title}</Card.Header>
                    <Card.Body style={{ height: "8rem" }}>
                    <Card.Title>{collection.description}</Card.Title>
                    <Card.Text>{collection.collection_keywords.map(obj => `#${obj.keyword}`).join(', ')}</Card.Text>
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

  function getCollections() {
    apiAxios
      .get(`/api/collections?p=1`)
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
          setCollections(tempArr);
        }
      }).catch((e) => {
        console.log('axios 통신실패');
        console.log(e);
      });
  }
};

export default MainCollections;
